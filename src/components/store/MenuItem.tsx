import type { Menu } from '@/types';

interface MenuItemProps {
  menu: Menu;
  quantity?: number;
  onAdd?: () => void;
  onRemove?: () => void;
  showControls?: boolean;
}

export default function MenuItem({ menu, quantity = 0, onAdd, onRemove, showControls = false }: MenuItemProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      {menu.image ? (
        <img src={menu.image} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
      ) : (
        <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🍽️</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{menu.name}</h4>
        {menu.description && (
          <p className="text-xs text-gray-300 mt-0.5 line-clamp-1">{menu.description}</p>
        )}
        <p className="text-sm font-semibold text-primary mt-1">
          {menu.price.toLocaleString()}원
        </p>
      </div>
      {showControls && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {quantity > 0 && (
            <>
              <button
                onClick={onRemove}
                className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-300"
              >
                -
              </button>
              <span className="text-sm font-medium w-5 text-center">{quantity}</span>
            </>
          )}
          <button
            onClick={onAdd}
            className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
