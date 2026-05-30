import { useCallback, useEffect, useState } from 'react';
import Table from '../components/Table';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { customerService } from '../services/customers';
import type { CustomerCreate, CustomerResponse } from '../models/customers';
import { usePersistentList } from '../hooks/usePersistentList';
import Pagination from '../components/Pagination';

type CustomerRow = CustomerResponse;

const Customers = () => {
  const [createdCustomers, setCreatedCustomers] =
    usePersistentList<CustomerRow>('createdCustomers');
  const [customers, setCustomers] = useState<CustomerRow[]>(
    () => createdCustomers
  );
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [searchDocument, setSearchDocument] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomerCreate>({
    document_number: '',
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadCustomers = useCallback(
    async (pageToLoad = 1) => {
      try {
        setLoading(true);
        setError(null);
        const response = await customerService.getAll(pageToLoad, pageSize);
        setCustomers(response.customers);
        setTotalItems(response.total);
        setTotalPages(response.total_pages);
        setPage(response.page);
        setIsSearching(false);
      } catch {
        setCustomers(createdCustomers);
        setTotalItems(createdCustomers.length);
        setTotalPages(1);
        setPage(1);
        setError('No se pudo cargar la lista de clientes');
      } finally {
        setLoading(false);
      }
    },
    [createdCustomers, pageSize]
  );

  useEffect(() => {
    void loadCustomers(1);
  }, [loadCustomers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      if (editingCustomer) {
        const updateData = {
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          address: formData.address,
        };
        const updatedCustomer = await customerService.update(
          editingCustomer,
          updateData
        );
        setCustomers(prev =>
          prev.map(customer =>
            customer.document_number === editingCustomer
              ? { ...customer, ...updatedCustomer }
              : customer
          )
        );
        setCreatedCustomers(prev =>
          prev.map(customer =>
            customer.document_number === editingCustomer
              ? { ...customer, ...updatedCustomer }
              : customer
          )
        );
        setSuccess('Cliente actualizado correctamente');
        setEditingCustomer(null);
        resetForm();
        await loadCustomers(page);
      } else {
        const createdCustomer = await customerService.create(formData);
        setCustomers(prev => [createdCustomer, ...prev]);
        setCreatedCustomers(prev => [createdCustomer, ...prev]); // Also track in created list
        setSuccess(
          'Cliente creado correctamente: ' + createdCustomer.document_number
        );
        // Clear form but keep showing the newly created customer in the results
        setFormData({
          document_number: '',
          full_name: '',
          email: '',
          phone_number: '',
          address: '',
        });
        setShowForm(false);
        await loadCustomers(1);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Error al guardar cliente'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCustomer = async (document: string) => {
    if (!document.trim()) {
      setSearchDocument('');
      setCustomers([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const customer = await customerService.getByDocument(document);
      setCustomers([customer]);
      setTotalItems(1);
      setTotalPages(1);
      setPage(1);
      setIsSearching(true);
      setSuccess('Cliente encontrado');
    } catch {
      setError('Cliente no encontrado');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchDocument('');
    void loadCustomers(page);
    setError(null);
    setSuccess(null);
  };

  const handleEdit = (customer: CustomerRow) => {
    setFormData({
      document_number: customer.document_number,
      full_name: customer.full_name,
      email: customer.email,
      phone_number: customer.phone_number,
      address: customer.address,
    });
    setEditingCustomer(customer.document_number);
    setShowForm(true);
    setSuccess(null);
    setError(null);
  };

  const handleDelete = async (document: string) => {
    setCustomerToDelete(document);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;

    try {
      setLoading(true);
      await customerService.delete(customerToDelete);
      setSuccess('Cliente eliminado correctamente');
      setCustomers(prev =>
        prev.filter(customer => customer.document_number !== customerToDelete)
      );
      setCreatedCustomers(prev =>
        prev.filter(customer => customer.document_number !== customerToDelete)
      );
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
      await loadCustomers(page);
    } catch {
      setError('Error al eliminar cliente');
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      document_number: '',
      full_name: '',
      email: '',
      phone_number: '',
      address: '',
    });
    setEditingCustomer(null);
    setShowForm(false);
    setSuccess(null);
    setError(null);
  };

  const formatDocument = (value: string): string => {
    // Normalize: remove spaces and make uppercase
    const v = value.replace(/\s+/g, '').toUpperCase();
    // Remove any existing CC- prefix (allows user to type numbers)
    const withoutPrefix = v.replace(/^CC-?/, '');

    // If empty, keep the visible prefix so users can't remove it completely
    if (withoutPrefix === '') return 'CC-';

    // If the remaining part is digits, always prefix with CC-
    if (/^\d+$/.test(withoutPrefix)) return `CC-${withoutPrefix}`;

    // Fallback: preserve user's input but keep CC- prefix
    return `CC-${withoutPrefix}`;
  };

  const columns = [
    { key: 'document_number', label: 'Documento' },
    { key: 'full_name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'phone_number', label: 'Teléfono' },
    { key: 'address', label: 'Dirección' },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_value: unknown, customer: CustomerRow) => (
        <div className='actions-cell'>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => handleEdit(customer)}
          >
            Editar
          </Button>
          <Button
            variant='danger'
            size='sm'
            onClick={() => handleDelete(customer.document_number)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <section className='section-customers'>
      <div className='section-header'>
        <div className='section-heading-group'>
          <h2>Gestión de Clientes</h2>
          <p className='section-description'>
            Consulta, crea, edita y elimina clientes por documento sin perder el
            contexto de la pantalla.
          </p>
        </div>
        <Button variant='success' onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nuevo Cliente'}
        </Button>
      </div>

      {error && <div className='alert alert-error'>{error}</div>}
      {success && <div className='alert alert-success'>{success}</div>}

      {showForm && (
        <Card title={editingCustomer ? 'Editar Cliente' : 'Crear Cliente'}>
          <form onSubmit={handleSubmit} className='form-customer'>
            <div className='form-group'>
              <label htmlFor='document_number'>Documento</label>
              <input
                id='document_number'
                type='text'
                placeholder='CC-12345678'
                value={formData.document_number}
                onChange={e =>
                  setFormData({
                    ...formData,
                    document_number: formatDocument(e.target.value),
                  })
                }
                disabled={!!editingCustomer}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='full_name'>Nombre Completo</label>
              <input
                id='full_name'
                type='text'
                placeholder='Juan Pérez'
                value={formData.full_name}
                onChange={e =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                type='email'
                placeholder='juan@example.com'
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='phone_number'>Teléfono</label>
              <input
                id='phone_number'
                type='tel'
                placeholder='3001234567'
                value={formData.phone_number}
                onChange={e =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='address'>Dirección</label>
              <textarea
                id='address'
                placeholder='Calle 123, Apartamento 456'
                value={formData.address}
                onChange={e =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
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

      <div className='customers-layout'>
        <Card
          title='Buscar cliente'
          subtitle='Escribe el documento completo para consultar un cliente existente.'
          className='customers-panel'
        >
          <div className='search-section search-section-customer'>
            <input
              type='text'
              placeholder='Buscar cliente por documento'
              value={searchDocument}
              onChange={e => setSearchDocument(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearchCustomer(searchDocument);
                }
              }}
            />
            <Button onClick={() => handleSearchCustomer(searchDocument)}>
              Buscar
            </Button>
            <Button
              type='button'
              variant='secondary'
              onClick={handleClearSearch}
              disabled={loading && customers.length === 0}
            >
              Limpiar
            </Button>
          </div>
        </Card>

        <Card
          title='Resultados'
          subtitle={
            totalItems > 0
              ? `${totalItems} cliente${totalItems === 1 ? '' : 's'} ${isSearching ? 'en búsqueda' : 'cargados'}`
              : 'No hay clientes cargados en pantalla'
          }
          className='customers-panel'
        >
          <Table
            data={customers}
            columns={columns}
            loading={loading}
            emptyMessage='No hay clientes para mostrar'
          />
          {!isSearching && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={nextPage => void loadCustomers(nextPage)}
              loading={loading}
            />
          )}
        </Card>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        title='Eliminar cliente'
        message={`¿Está seguro de que desea eliminar al cliente ${customerToDelete}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText='Eliminar'
        cancelText='Cancelar'
        isDangerous={true}
      />
    </section>
  );
};

export default Customers;
