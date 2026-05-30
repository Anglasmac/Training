import { useCallback, useEffect, useState } from 'react';
import { MealCard } from '../components/Card';
import Button from '../components/Button';
import Card from '../components/Card';
import { mealService } from '../services/meals';
import type {
  MealCreate,
  MealResponse,
  MealUpdate,
  CategoryEnum,
} from '../models/meals';
import { usePersistentList } from '../hooks/usePersistentList';
import Pagination from '../components/Pagination';

const categoryLabels: Record<string, string> = {
  HAMBURGERS_AND_HOTDOGS: 'Hamburguesas y Hot Dogs',
  CHICKEN: 'Pollo',
  FISH: 'Pescado',
  MEATS: 'Carnes',
  DESSERTS: 'Postres',
  VEGAN_FOOD: 'Comida Vegana',
  KIDS_MEALS: 'Menú Infantil',
};

const Meals = () => {
  const [savedMeals, setSavedMeals] =
    usePersistentList<MealResponse>('createdMeals');
  const [meals, setMeals] = useState<MealResponse[]>(() => savedMeals);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<string | null>(null);
  const [searchUuid, setSearchUuid] = useState('');
  const [formData, setFormData] = useState<MealCreate>({
    name: '',
    category: 'HAMBURGERS_AND_HOTDOGS' as CategoryEnum,
    description: '',
    price_without_iva: 0,
    is_available: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadMeals = useCallback(
    async (pageToLoad = 1) => {
      try {
        setLoading(true);
        setError(null);
        const response = await mealService.getAll(pageToLoad, pageSize);
        setMeals(response.meals);
        setTotalItems(response.total);
        setTotalPages(response.total_pages);
        setPage(response.page);
        setIsSearching(false);
      } catch {
        setMeals(savedMeals);
        setTotalItems(savedMeals.length);
        setTotalPages(1);
        setPage(1);
        setError('No se pudo cargar la lista de combos');
      } finally {
        setLoading(false);
      }
    },
    [pageSize, savedMeals]
  );

  useEffect(() => {
    void loadMeals(1);
  }, [loadMeals]);

  const mergeMeal = (meal: MealResponse) => {
    setMeals(prev => [meal, ...prev.filter(item => item.uuid !== meal.uuid)]);
    setSavedMeals(prev => [
      meal,
      ...prev.filter(item => item.uuid !== meal.uuid),
    ]);
  };

  const handleSearchMeal = async (uuid: string) => {
    if (!uuid.trim()) {
      setSearchUuid('');
      void loadMeals(page);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const meal = await mealService.getById(uuid.trim());
      setMeals([meal]);
      setTotalItems(1);
      setTotalPages(1);
      setPage(1);
      setIsSearching(true);
      setSuccess('Combo encontrado');
    } catch {
      setMeals([]);
      setError('Combo no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      if (editingMeal) {
        const updateData: MealUpdate = {
          name: formData.name,
          category: formData.category,
          description: formData.description,
          price_without_iva: formData.price_without_iva,
          is_available: formData.is_available,
        };
        const updatedMeal = await mealService.update(editingMeal, updateData);
        mergeMeal(updatedMeal);
        setSuccess('Combo actualizado correctamente');
        await loadMeals(page);
      } else {
        const createdMeal = await mealService.create(formData);
        mergeMeal(createdMeal);
        setSuccess('Combo creado correctamente');
        await loadMeals(1);
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar combo');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (meal: MealResponse) => {
    setFormData({
      name: meal.name,
      category: meal.category,
      description: meal.description,
      price_without_iva: meal.price_without_iva,
      is_available: meal.is_available,
    });
    setEditingMeal(meal.uuid);
    setShowForm(true);
  };

  const handleDelete = async (uuid: string) => {
    if (!confirm('¿Está seguro de eliminar este combo?')) return;

    try {
      setLoading(true);
      await mealService.delete(uuid);
      setSuccess('Combo eliminado correctamente');
      setMeals(prev => prev.filter(meal => meal.uuid !== uuid));
      setSavedMeals(prev => prev.filter(meal => meal.uuid !== uuid));
      await loadMeals(page);
    } catch {
      setError('Error al eliminar combo');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'HAMBURGERS_AND_HOTDOGS' as CategoryEnum,
      description: '',
      price_without_iva: 0,
      is_available: true,
    });
    setEditingMeal(null);
    setShowForm(false);
  };

  const availableMeals = meals.filter(m => m.is_available).length;
  const totalMeals = meals.length;

  return (
    <section className='section-meals'>
      <div className='section-header'>
        <div className='section-heading-group'>
          <h2>Gestión de Combos</h2>
          <p className='section-description'>
            Busca por UUID, crea o edita un combo, y revisa el estado de
            disponibilidad sin perder el foco operativo.
          </p>
        </div>
      </div>

      {error && <div className='alert alert-error'>{error}</div>}
      {success && <div className='alert alert-success'>{success}</div>}

      <div className='module-summary-row'>
        <div className='metric-chip'>
          <span className='metric-chip-label'>Total</span>
          <strong>{totalMeals}</strong>
        </div>
        <div className='metric-chip metric-chip-success'>
          <span className='metric-chip-label'>Disponibles</span>
          <strong>{availableMeals}</strong>
        </div>
        <div className='metric-chip metric-chip-warn'>
          <span className='metric-chip-label'>No disponibles</span>
          <strong>{totalMeals - availableMeals}</strong>
        </div>
      </div>

      <div className='module-workspace module-workspace-meals'>
        <Card
          title='Buscar combo'
          subtitle='Consulta un combo por nombre o UUID y trabaja sobre ese registro.'
          className='module-pane'
        >
          <div className='search-pill'>
            <div className='search-input-wrapper'>
              <svg
                className='search-icon'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M21 21L15.8 15.8'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <input
                type='text'
                placeholder='Buscar por nombre o UUID...'
                value={searchUuid}
                onChange={e => setSearchUuid(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearchMeal(searchUuid);
                  }
                }}
              />
            </div>

            <Button
              className='btn-new-combo'
              onClick={() => {
                setEditingMeal(null);
                setShowForm(true);
              }}
            >
              Nuevo Combo
            </Button>
          </div>
        </Card>

        {showForm && (
          <Card
            title={editingMeal ? 'Editar Combo' : 'Crear Combo'}
            subtitle='Nombre en mayúsculas, categoría y precio sin IVA.'
            className='module-pane'
          >
            <form onSubmit={handleSubmit} className='form-meal'>
              <div className='form-group'>
                <label htmlFor='name'>Nombre</label>
                <input
                  id='name'
                  type='text'
                  placeholder='Ej: Combo Especial'
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='category'>Categoría</label>
                <select
                  id='category'
                  value={formData.category}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      category: e.target.value as CategoryEnum,
                    })
                  }
                  required
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className='form-group'>
                <label htmlFor='description'>Descripción</label>
                <textarea
                  id='description'
                  placeholder='Descripción del combo'
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='price_without_iva'>Precio (sin IVA)</label>
                <input
                  id='price_without_iva'
                  type='number'
                  step='0.01'
                  min='0'
                  placeholder='0.00'
                  value={formData.price_without_iva}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      price_without_iva:
                        e.target.value === '' ? 0 : parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className='form-group form-group-inline'>
                <label htmlFor='is_available'>
                  <input
                    id='is_available'
                    type='checkbox'
                    checked={formData.is_available}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        is_available: e.target.checked,
                      })
                    }
                  />
                  Disponible
                </label>
              </div>

              <div className='form-actions'>
                <Button type='submit' variant='success' disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button type='button' variant='secondary' onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        <Card
          title='Resultados'
          subtitle={
            totalItems > 0
              ? `${totalItems} combo${totalItems === 1 ? '' : 's'} ${isSearching ? 'en búsqueda' : 'cargados'}`
              : 'No hay combos disponibles'
          }
          className='module-pane module-pane-wide'
        >
          <div className='meals-grid meals-grid-compact'>
            {loading && <div className='loading'>Cargando combos...</div>}
            {!loading && meals.length === 0 && (
              <div className='empty-state'>No hay combos disponibles</div>
            )}
            {!loading &&
              meals.map(meal => (
                <MealCard
                  key={meal.uuid}
                  meal={{
                    uuid: meal.uuid,
                    name: meal.name,
                    category: meal.category,
                    description: meal.description,
                    price: Number(meal.price_without_iva),
                    available: meal.is_available,
                  }}
                  categoryLabels={categoryLabels}
                  onEdit={() => handleEdit(meal)}
                  onDelete={() => handleDelete(meal.uuid)}
                />
              ))}
          </div>
          {!isSearching && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={nextPage => void loadMeals(nextPage)}
              loading={loading}
            />
          )}
        </Card>
      </div>
    </section>
  );
};

export default Meals;
