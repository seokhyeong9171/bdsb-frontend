# BDSB AWS 배포 가이드

EC2 + Nginx + GitHub Actions 기반 무중단 배포 가이드입니다.

---

## 아키텍처

```
[사용자] → [EC2 : Nginx (80)] → 정적파일 (프론트엔드 dist/)
                               → /api/* → Node.js (3000, PM2)
                               → /socket.io/* → Node.js (WebSocket)
```

---

## 1단계: EC2 인스턴스 생성

### AWS 콘솔에서 EC2 생성
1. **AWS 콘솔** → EC2 → 인스턴스 시작
2. 설정:
   - **이름**: bdsb-server
   - **AMI**: Ubuntu 24.04 LTS
   - **인스턴스 유형**: t3.small (2 vCPU, 2GB RAM)
   - **키 페어**: 새로 생성 → `bdsb-key.pem` 다운로드
   - **보안 그룹**: 아래 규칙 추가

### 보안 그룹 규칙
| 유형 | 포트 | 소스 | 용도 |
|---|---|---|---|
| SSH | 22 | 내 IP | SSH 접속 |
| HTTP | 80 | 0.0.0.0/0 | 웹 서비스 |
| HTTPS | 443 | 0.0.0.0/0 | (나중에 SSL 추가 시) |

3. **스토리지**: 20GB gp3
4. **탄력적 IP 할당**: EC2 → 탄력적 IP → 할당 → 인스턴스에 연결

---

## 2단계: EC2 서버 초기 설정

### SSH 접속
```bash
chmod 400 bdsb-key.pem
ssh -i bdsb-key.pem ubuntu@<EC2_퍼블릭_IP>
```

### 기본 패키지 설치
```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Node.js 20 LTS 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 전역 설치
sudo npm install -g pm2

# Nginx 설치
sudo apt install -y nginx

# Git 설치 (보통 이미 있음)
sudo apt install -y git

# 버전 확인
node -v    # v20.x.x
npm -v     # 10.x.x
pm2 -v     # 5.x.x
nginx -v   # nginx/1.x.x
```

---

## 3단계: MariaDB 설치 및 설정

```bash
# MariaDB 설치
sudo apt install -y mariadb-server

# 보안 초기 설정
sudo mysql_secure_installation
# - root 비밀번호 설정
# - 익명 사용자 제거: Y
# - 원격 root 로그인 차단: Y
# - 테스트 DB 삭제: Y

# DB 및 사용자 생성
sudo mysql -u root -p
```

```sql
CREATE DATABASE BDSB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bdsb'@'localhost' IDENTIFIED BY '원하는_비밀번호';
GRANT ALL PRIVILEGES ON BDSB.* TO 'bdsb'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 4단계: 프로젝트 배포

### Git 리포지토리 클론
```bash
cd /home/ubuntu

# 프론트엔드
git clone https://github.com/<사용자명>/bdsb-frontend.git
cd bdsb-frontend
npm install --legacy-peer-deps
npm run build

# 백엔드
cd /home/ubuntu
git clone https://github.com/<사용자명>/bdsb-backend.git
cd bdsb-backend
npm install --production
```

### 백엔드 환경변수 설정
```bash
cp /home/ubuntu/bdsb-frontend/deploy/.env.example /home/ubuntu/bdsb-backend/.env
nano /home/ubuntu/bdsb-backend/.env
# DB_PASSWORD, JWT_SECRET 값을 실제 값으로 변경
```

**JWT_SECRET 생성 팁:**
```bash
openssl rand -hex 32
```

### DB 테이블 초기화
```bash
cd /home/ubuntu/bdsb-backend
node src/database/init.js
```

---

## 5단계: PM2로 백엔드 실행

```bash
# 로그 디렉토리 생성
mkdir -p /home/ubuntu/logs

# ecosystem 파일로 실행
pm2 start /home/ubuntu/bdsb-frontend/deploy/ecosystem.config.js

# 상태 확인
pm2 status
pm2 logs bdsb-backend

# 서버 재부팅 시 자동 시작 설정
pm2 startup
# 출력된 명령어를 복사해서 실행 (sudo env PATH=... pm2 startup ...)
pm2 save
```

### PM2 주요 명령어
```bash
pm2 status              # 상태 확인
pm2 logs bdsb-backend   # 로그 보기
pm2 reload bdsb-backend # 무중단 재시작
pm2 restart bdsb-backend # 완전 재시작
pm2 monit               # 리소스 모니터링
```

---

## 6단계: Nginx 설정

```bash
# 기본 설정 제거
sudo rm /etc/nginx/sites-enabled/default

# BDSB 설정 복사
sudo cp /home/ubuntu/bdsb-frontend/deploy/nginx.conf /etc/nginx/sites-available/bdsb
sudo ln -s /etc/nginx/sites-available/bdsb /etc/nginx/sites-enabled/bdsb

# 설정 검증
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 확인
```bash
# 브라우저에서 접속
# http://<EC2_퍼블릭_IP>
```

---

## 7단계: GitHub Actions 자동 배포 설정

### GitHub Secrets 설정
리포지토리 → Settings → Secrets and variables → Actions → New repository secret:

| Secret 이름 | 값 |
|---|---|
| `EC2_HOST` | EC2 퍼블릭 IP (또는 탄력적 IP) |
| `EC2_SSH_KEY` | `bdsb-key.pem` 파일의 전체 내용 |

**SSH 키 내용 복사 방법 (로컬에서):**
```bash
cat bdsb-key.pem
# -----BEGIN RSA PRIVATE KEY----- 부터 -----END RSA PRIVATE KEY----- 까지 전체 복사
```

### 배포 트리거
`master` 브랜치에 push하면 자동으로 배포됩니다:

```bash
git add .
git commit -m "배포 테스트"
git push origin master
# → GitHub Actions가 자동으로 EC2에 배포
```

GitHub → Actions 탭에서 배포 진행 상황을 확인할 수 있습니다.

---

## 8단계: 수동 배포 (필요 시)

GitHub Actions 대신 수동으로 배포할 때:

```bash
# EC2에 SSH 접속 후
cd /home/ubuntu/bdsb-frontend
bash deploy/deploy.sh
```

---

## 운영 가이드

### 로그 확인
```bash
# 백엔드 로그
pm2 logs bdsb-backend
tail -f /home/ubuntu/logs/backend-out.log
tail -f /home/ubuntu/logs/backend-error.log

# Nginx 로그
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 서버 상태 확인
```bash
pm2 status           # 프로세스 상태
pm2 monit            # 실시간 모니터링
df -h                # 디스크 사용량
free -m              # 메모리 사용량
```

### 문제 해결

**백엔드가 안 뜨는 경우:**
```bash
pm2 logs bdsb-backend --lines 50   # 에러 로그 확인
cat /home/ubuntu/bdsb-backend/.env  # 환경변수 확인
sudo systemctl status mariadb       # DB 상태 확인
```

**Nginx 502 Bad Gateway:**
```bash
pm2 status                          # 백엔드가 실행 중인지 확인
curl http://localhost:3000/api/stores  # 백엔드 직접 접근 테스트
sudo nginx -t                       # Nginx 설정 오류 확인
```

**프론트엔드 흰 화면:**
```bash
ls /home/ubuntu/bdsb-frontend/dist  # 빌드 파일 존재 확인
sudo nginx -t                       # Nginx 설정 확인
```

---

## 나중에 추가: 도메인 + HTTPS

### 도메인 연결
1. 도메인 구매 (가비아, Route53 등)
2. DNS A 레코드에 EC2 탄력적 IP 등록

### SSL 인증서 (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
# 자동 갱신 확인
sudo certbot renew --dry-run
```

Nginx 설정에서 `server_name _` 를 `server_name your-domain.com` 으로 변경합니다.

---

## 예상 월 비용

| 항목 | 비용 (USD) |
|---|---|
| EC2 t3.small (온디맨드) | ~$15/월 |
| EBS 20GB gp3 | ~$1.6/월 |
| 탄력적 IP (사용 중) | 무료 |
| 데이터 전송 (월 10GB) | ~$0.9/월 |
| **총 예상** | **~$18/월** |

> 프리 티어 계정(12개월)은 t3.micro 무료. t3.small은 유료입니다.
