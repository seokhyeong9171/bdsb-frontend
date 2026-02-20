#!/bin/bash
set -e

# ==========================================
# BDSB 무중단 배포 스크립트
# ==========================================

DEPLOY_DIR="/home/ubuntu"
FRONTEND_DIR="$DEPLOY_DIR/bdsb-frontend"
BACKEND_DIR="$DEPLOY_DIR/bdsb-backend"
LOG_DIR="$DEPLOY_DIR/logs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 색상
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# 로그 디렉토리 확인
mkdir -p "$LOG_DIR"

# ==========================================
# 1. 소스 코드 업데이트
# ==========================================
log "소스 코드 업데이트 중..."

cd "$FRONTEND_DIR"
git fetch origin
git reset --hard origin/master
log "프론트엔드 코드 업데이트 완료"

cd "$BACKEND_DIR"
git fetch origin
git reset --hard origin/master
log "백엔드 코드 업데이트 완료"

# ==========================================
# 2. 백엔드 의존성 설치 + 무중단 재시작
# ==========================================
log "백엔드 의존성 설치 중..."
cd "$BACKEND_DIR"
npm install --production

log "백엔드 무중단 재시작 중..."
pm2 reload bdsb-backend --update-env
log "백엔드 재시작 완료"

# ==========================================
# 3. 프론트엔드 빌드
# ==========================================
log "프론트엔드 빌드 중..."
cd "$FRONTEND_DIR"
npm install
npm run build

log "프론트엔드 빌드 완료"

# ==========================================
# 4. 상태 확인
# ==========================================
log "배포 상태 확인..."
pm2 status

# 헬스체크
sleep 2
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/stores || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
    log "백엔드 헬스체크 OK (HTTP $HTTP_STATUS)"
else
    warn "백엔드 헬스체크 실패 (HTTP $HTTP_STATUS) - 로그를 확인하세요"
    pm2 logs bdsb-backend --lines 20
fi

log "=========================================="
log "배포 완료! ($TIMESTAMP)"
log "=========================================="
