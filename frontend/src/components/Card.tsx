import Button from './Button';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface MealCardMeal {
  uuid: string;
  name: string;
  category: string;
  description: string;
  price: number;
  available: boolean;
}

interface MealCardProps {
  meal: MealCardMeal;
  categoryLabels: Record<string, string>;
  onEdit?: (meal: MealCardMeal) => void;
  onDelete?: (meal: MealCardMeal) => void;
  className?: string;
}

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    HAMBURGERS_AND_HOTDOGS: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='cat-icon'
      >
        <path
          d='M4 13c0 1.66 1.34 3 3 3h10c1.66 0 3-1.34 3-3M4 13h16M4 13l1-3h14l1 3M8 13v2M12 13v2M16 13v2M5 10h14l-0.5-1.5c-0.2-0.6-0.8-1-1.5-1H6.5c-0.7 0-1.3 0.4-1.5 1L5 10'
          stroke='currentColor'
          strokeWidth='1.2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
    CHICKEN: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='cat-icon'
      >
        <path
          d='M12 2c-2 0-3 1-3 2v3c0 1 1 2 2 2h2c1 0 2-1 2-2V4c0-1-1-2-3-2zm-2 7c-1 0-2 1-2 2v5c0 2 1 3 3 3h4c2 0 3-1 3-3v-5c0-1-1-2-2-2h-6z'
          stroke='currentColor'
          strokeWidth='1.2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
    FISH: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='cat-icon'
      >
        <path
          d='M3 12c2-1 4-2 6-2h6c2 0 4 1 6 2m0 0l2 2m-2-2l2-2M19 12l-2 2m2-2l-2-2M9 10v4m3-4v4M4 12h1m10 0h1'
          stroke='currentColor'
          strokeWidth='1.2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
    MEATS: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='cat-icon'
      >
        <path
          d='M6 2c-2 0-3 1-3 3v8c0 2 1 4 3 4h1v2c0 1 1 2 2 2s2-1 2-2v-2h2v2c0 1 1 2 2 2s2-1 2-2v-2h1c2 0 3-2 3-4V5c0-2-1-3-3-3H6z'
          stroke='currentColor'
          strokeWidth='1.2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
    DESSERTS: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='cat-icon'
      >
        <path
          d='M4 6h16c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2zm0 0c0-1 .9-2 2-2h12c1.1 0 2 .9 2 2M8 4v2m4-2v2m4-2v2'
          stroke='currentColor'
          strokeWidth='1.2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
    VEGAN_FOOD: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='cat-icon'
      >
        <path
          d='M12 2c0 0-4 6-4 10c0 2.21 1.79 4 4 4s4-1.79 4-4c0-4-4-10-4-10zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-2 4c0 1.66-1.34 3-3 3s-3-1.34-3-3h1c0 1.1.9 2 2 2s2-.9 2-2h1zm6 0c0 1.66 1.34 3 3 3s3-1.34 3-3h-1c0 1.1-.9 2-2 2s-2-.9-2-2h-1z'
          stroke='currentColor'
          strokeWidth='1.2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
    KIDS_MEALS: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='cat-icon'
      >
        <path
          d='M12 2c-5.33 0-8 3-8 8v4c0 2 1 3 2 3h12c1 0 2-1 2-3v-4c0-5-2.67-8-8-8zm-4 8h2m2 0h2m2 0h2M8 14h8'
          stroke='currentColor'
          strokeWidth='1.2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
  };

  return iconMap[category] || iconMap.HAMBURGERS_AND_HOTDOGS;
};

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  onClick,
}: CardProps) => {
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {(title || subtitle) && (
        <div className='card-header'>
          {title && <h3 className='card-title'>{title}</h3>}
          {subtitle && <p className='card-subtitle'>{subtitle}</p>}
        </div>
      )}
      <div className='card-body'>{children}</div>
      {footer && <div className='card-footer'>{footer}</div>}
    </div>
  );
};

const MealCard = ({
  meal,
  categoryLabels,
  onEdit,
  onDelete,
  className = '',
}: MealCardProps) => {
  return (
    <Card className={`meal-card ${className}`}>
      <div className='meal-top'>
        <div className='meal-category'>
          <span className='category-badge'>
            {getCategoryIcon(meal.category)}
            {categoryLabels[meal.category] || meal.category}
          </span>
        </div>
        <div
          className={`availability ${meal.available ? 'available' : 'unavailable'}`}
        >
          {meal.available ? (
            <>
              <svg
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='avail-icon'
              >
                <path
                  d='M20 6L9 17l-5-5'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              Disponible
            </>
          ) : (
            'No disponible'
          )}
        </div>
      </div>

      <h3 className='meal-name'>{meal.name}</h3>

      <div className='meal-description-box'>
        <p className='meal-description'>{meal.description}</p>
      </div>

      <div className='meal-footer'>
        <div className='meal-price'>${meal.price.toFixed(2)}</div>
        <div className='meal-actions'>
          {onDelete && (
            <Button
              variant='danger'
              size='sm'
              className='btn-delete'
              onClick={() => onDelete(meal)}
            >
              <svg
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                className='btn-icon'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M18 6L6 18M6 6l12 12'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              Eliminar
            </Button>
          )}
        </div>
      </div>

      {onEdit && (
        <div className='meal-actions-left'>
          <Button
            variant='secondary'
            size='sm'
            className='btn-edit btn-icon-only'
            onClick={() => onEdit(meal)}
            title='Editar'
          >
            <svg
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='none'
              className='btn-icon'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'
            >
              <path
                d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z'
                stroke='currentColor'
                strokeWidth='1.2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'
                stroke='currentColor'
                strokeWidth='1.2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </Button>
        </div>
      )}
    </Card>
  );
};

export { Card, MealCard };
export default Card;
