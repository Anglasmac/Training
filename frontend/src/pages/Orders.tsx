import { useState } from 'react';
import Table, { type TableColumn } from '../components/Table';
import Button from '../components/Button';
import Card from '../components/Card';
import { orderService } from '../services/orders';
import { mealService } from '../services/meals';
import { customerService } from '../services/customers';
import type { OrderCreate, OrderResponse } from '../models/orders';
import { usePersistentList } from '../hooks/usePersistentList';

const Orders = () => {
  const [savedOrders, setSavedOrders] =
    usePersistentList<OrderResponse>('createdOrders');
  const [orders, setOrders] = useState<OrderResponse[]>(() => savedOrders);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<OrderCreate>({
    document: '',
    meal_uuid: '',
    quantity: 1,
    additional_info: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      await customerService.getByDocument(formData.document);
      await mealService.getById(formData.meal_uuid);

      const createdOrder = await orderService.create(formData);
      setOrders(prev => [createdOrder, ...prev]);
      setSavedOrders(prev => [
        createdOrder,
        ...prev.filter(order => order.uuid !== createdOrder.uuid),
      ]);
      setSuccess('Pedido creado correctamente');
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDelivered = async (uuid: string) => {
    try {
      setLoading(true);
      const updatedOrder = await orderService.update(uuid, {
        timestamp: new Date().toISOString(),
      });
      setOrders(prev =>
        prev.map(order => (order.uuid === uuid ? updatedOrder : order))
      );
      setSavedOrders(prev =>
        prev.map(order => (order.uuid === uuid ? updatedOrder : order))
      );
      setSuccess('Pedido marcado como entregado');
    } catch {
      setError('Error al actualizar pedido');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      document: '',
      meal_uuid: '',
      quantity: 1,
      additional_info: '',
    });
    setShowForm(false);
  };

  const columns: TableColumn<OrderResponse>[] = [
    { key: 'uuid', label: 'ID' },
    { key: 'document', label: 'Documento Cliente' },
    { key: 'quantity', label: 'Cantidad' },
    {
      key: 'total_with_iva',
      label: 'Total',
      render: (value: unknown) => `$${(value as number).toFixed(2)}`,
    },
    {
      key: 'is_delivered',
      label: 'Estado',
      render: (value: unknown) => (
        <span className={(value as boolean) ? 'status-delivered' : 'status-pending'}>
          {(value as boolean) ? 'Entregado' : 'Pendiente'}
        </span>
      ),
    },
    {
      key: 'order_date',
      label: 'Fecha',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('es-CO'),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_value: unknown, order: OrderResponse) => (
        <div className='actions-cell'>
          {!order.is_delivered && (
            <Button
              variant='success'
              size='sm'
              onClick={() => handleMarkAsDelivered(order.uuid)}
            >
              Entregar
            </Button>
          )}
        </div>
      ),
    },
  ];

  const pendingOrders = orders.filter(order => !order.is_delivered).length;
  const deliveredOrders = orders.filter(order => order.is_delivered).length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total_with_iva || 0),
    0
  );

  return (
    <section className='section-orders'>
      <div className='section-header'>
        <div className='section-heading-group'>
          <h2>Gestión de Pedidos</h2>
          <p className='section-description'>
            Crea pedidos, valida cliente y combo, y marca entregas desde la
            sesión activa.
          </p>
        </div>
        <Button variant='success' onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nuevo Pedido'}
        </Button>
      </div>

      {error && <div className='alert alert-error'>{error}</div>}
      {success && <div className='alert alert-success'>{success}</div>}

      <div className='module-summary-row'>
        <div className='metric-chip'>
          <span className='metric-chip-label'>Pendientes</span>
          <strong>{pendingOrders}</strong>
        </div>
        <div className='metric-chip metric-chip-success'>
          <span className='metric-chip-label'>Entregados</span>
          <strong>{deliveredOrders}</strong>
        </div>
        <div className='metric-chip metric-chip-accent'>
          <span className='metric-chip-label'>Ingresos</span>
          <strong>${totalRevenue.toFixed(2)}</strong>
        </div>
      </div>

      <div className='module-workspace module-workspace-orders'>
        {showForm && (
          <Card
            title='Crear pedido'
            subtitle='Valida cliente y combo antes de guardar el pedido.'
            className='module-pane module-pane-sticky'
          >
            <form onSubmit={handleSubmit} className='form-order'>
              <div className='form-group'>
                <label htmlFor='document'>Documento del Cliente</label>
                <input
                  id='document'
                  type='text'
                  placeholder='CC-12345678'
                  value={formData.document}
                  onChange={e =>
                    setFormData({ ...formData, document: e.target.value })
                  }
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='meal_uuid'>UUID del Combo</label>
                <input
                  id='meal_uuid'
                  type='text'
                  placeholder='123e4567-e89b-12d3-a456-426614174000'
                  value={formData.meal_uuid}
                  onChange={e =>
                    setFormData({ ...formData, meal_uuid: e.target.value })
                  }
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='quantity'>Cantidad</label>
                <input
                  id='quantity'
                  type='number'
                  min='1'
                  max='99'
                  value={formData.quantity}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value || '1', 10),
                    })
                  }
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='additional_info'>Información Adicional</label>
                <textarea
                  id='additional_info'
                  placeholder='Notas especiales, preferencias, etc.'
                  value={formData.additional_info}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      additional_info: e.target.value,
                    })
                  }
                  maxLength={511}
                />
              </div>

              <div className='form-actions'>
                <Button type='submit' variant='success' disabled={loading}>
                  {loading ? 'Creando...' : 'Crear Pedido'}
                </Button>
                <Button type='button' variant='secondary' onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        <Card
          title='Pedidos registrados'
          subtitle='La tabla muestra solo los pedidos creados en la sesión actual.'
          className='module-pane module-pane-wide'
        >
          <Table
            data={orders}
            columns={columns}
            loading={loading}
            emptyMessage='No hay pedidos para mostrar'
          />
        </Card>
      </div>
    </section>
  );
};

export default Orders;
