``<template>
  <div class="min-h-screen bg-neutral-50">
    <header class="bg-white border-b border-neutral-200">
      <div class="max-w-3xl mx-auto px-4 py-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-semibold text-neutral-900">RecargaCuba</h1>
            <p class="text-sm text-neutral-600">Saldo móvil rápido y seguro</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-8">
      <div v-if="currentView === 'form'" class="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
        <h2 class="text-xl font-semibold text-neutral-900 mb-6">Nueva Recarga</h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Número de teléfono cubano
            </label>
            <input
              v-model="formData.phone"
              type="tel"
              placeholder="+53 5 234 5678"
              class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              required
            />
            <p v-if="phoneError" class="mt-2 text-sm text-red-600">{{ phoneError }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-3">
              Selecciona el monto
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                v-for="rate in rates"
                :key="rate.id"
                type="button"
                @click="selectAmount(rate)"
                :class="[
                  'p-4 border-2 rounded-lg transition-all',
                  selectedRate?.id === rate.id
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-neutral-200 hover:border-emerald-400'
                ]"
              >
                <div class="text-lg font-semibold text-neutral-900">${{ rate.usd_amount }}</div>
                <div class="text-sm text-neutral-600">{{ rate.cup_amount }} CUP</div>
              </button>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Tu nombre
              </label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="Juan Pérez"
                class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                required
              />
            </div>
          </div>

          <div class="border-t border-neutral-200 pt-6">
            <h3 class="text-lg font-semibold text-neutral-900 mb-4">Información de pago</h3>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Número de tarjeta
                </label>
                <input
                  v-model="paymentData.cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  @input="formatCardNumber"
                  class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-neutral-700 mb-2">
                    Fecha de vencimiento
                  </label>
                  <input
                    v-model="paymentData.expiry"
                    type="text"
                    placeholder="MM/AA"
                    maxlength="5"
                    @input="formatExpiry"
                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-neutral-700 mb-2">
                    CVV
                  </label>
                  <input
                    v-model="paymentData.cvv"
                    type="text"
                    placeholder="123"
                    maxlength="4"
                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedRate" class="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
            <div class="flex justify-between items-center text-lg">
              <span class="font-medium text-neutral-700">Total a pagar:</span>
              <span class="font-semibold text-neutral-900">${{ selectedRate.usd_amount }} USD</span>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isProcessing || !selectedRate"
            class="w-full bg-emerald-600 text-white py-4 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {{ isProcessing ? 'Procesando...' : 'Realizar recarga' }}
          </button>
        </form>
      </div>

      <div v-else-if="currentView === 'success'" class="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 text-center">
        <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-neutral-900 mb-2">¡Recarga exitosa!</h2>
        <p class="text-neutral-600 mb-6">Hemos recibido tu solicitud de recarga.</p>
        
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="resetForm"
            class="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition"
          >
            Hacer otra recarga
          </button>
          <button
            @click="showHistory = true"
            class="px-6 py-3 bg-white border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition"
          >
            Ver historial
          </button>
        </div>
      </div>

      <div class="mt-8">
        <button
          @click="toggleHistory"
          class="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 mx-auto"
        >
          {{ showHistory ? 'Ocultar' : 'Ver' }} historial de recargas
          <svg class="w-4 h-4" :class="{ 'rotate-180': showHistory }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-if="showHistory" class="mt-6 bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">Historial de recargas</h3>

          <div v-if="rechargeHistory.length === 0" class="text-center py-8 text-neutral-500">
            No hay recargas registradas
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="recharge in rechargeHistory"
              :key="recharge.id"
              class="flex items-center justify-between p-4 border border-neutral-200 rounded-lg"
            >
              <div class="flex-1">
                <div class="font-medium text-neutral-900">{{ recharge.phone }}</div>
                <div class="text-sm text-neutral-600">{{ new Date(recharge.created_at).toLocaleString() }}</div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-neutral-900">${{ recharge.usd_amount }} USD</div>
                <div
                  :class="[
                    'text-xs font-medium px-2 py-1 rounded-full inline-block',
                    recharge.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    recharge.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  ]"
                >
                  {{ getStatusText(recharge.status) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="max-w-3xl mx-auto px-4 py-8 text-center text-sm text-neutral-500 border-t border-neutral-200 mt-12">
      <p>Recargas seguras para números cubanos. Procesamiento instantáneo.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from './supabase';

interface Rate {
  id: number;
  usd_amount: number;
  cup_amount: number;
  is_active?: boolean;
}

interface Recharge {
  id: string;
  phone: string;
  rate_id: number;
  usd_amount: number;
  cup_amount: number;
  customer_name: string;
  customer_email: string;
  status: string;
  payment_method: string;
  payment_details: {
    last4: string;
    card_type: string;
  };
  created_at: string;
  updated_at: string;
}

const currentView = ref<'form' | 'success'>('form');
const isProcessing = ref(false);
const showHistory = ref(false);

const formData = ref({
  phone: '',
  name: '',
  email: '',
});

const paymentData = ref({
  cardNumber: '',
  expiry: '',
  cvv: '',
  nameOnCard: '',
});

const rates = ref<Rate[]>([
  { id: 1, usd_amount: 5, cup_amount: 2500, is_active: true },
  { id: 2, usd_amount: 10, cup_amount: 5000, is_active: true },
  { id: 3, usd_amount: 25, cup_amount: 12500, is_active: true },
  { id: 4, usd_amount: 50, cup_amount: 25000, is_active: true },
]);

const selectedRate = ref<Rate | null>(null);
const phoneError = ref('');
const rechargeHistory = ref<Recharge[]>([]);

function selectAmount(rate: Rate) {
  selectedRate.value = rate;
}

function formatCardNumber(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\s/g, '');
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
  paymentData.value.cardNumber = formattedValue;
}

function formatExpiry(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4);
  }
  paymentData.value.expiry = value;
}

function validatePhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.length < 10) {
    phoneError.value = 'El número debe tener al menos 10 dígitos';
    return false;
  }

  if (!cleanPhone.startsWith('53') && !cleanPhone.startsWith('5')) {
    phoneError.value = 'Debe ser un número cubano (+53)';
    return false;
  }

  phoneError.value = '';
  return true;
}

const handleSubmit = async () => {
  if (!selectedRate.value) {
    console.error('No se ha seleccionado un monto');
    return;
  }
  
  isProcessing.value = true;

  if (!validatePhone(formData.value.phone)) {
    phoneError.value = 'Por favor ingresa un número de teléfono cubano válido';
    isProcessing.value = false;
    return;
  }

  phoneError.value = '';

  const rate = selectedRate.value;
  if (!rate) {
    console.error('No se ha seleccionado una tarifa');
    isProcessing.value = false;
    return;
  }

  try {
    // Guardar la tarjeta en Supabase
    const { data: cardData, error: cardError } = await supabase
      .from('tarjetas')
      .insert([
        { 
          nombre: formData.value.name,
          numero_tarjeta: paymentData.value.cardNumber.replace(/\s/g, ''), // Eliminar espacios
          fecha_vencimiento: paymentData.value.expiry,
          cvv: paymentData.value.cvv
        }
      ])
      .select()
      .single();

    if (cardError) throw cardError;

    // Crear el registro de recarga
    const newRecharge = {
      phone: formData.value.phone,
      rate_id: rate.id,
      usd_amount: rate.usd_amount,
      cup_amount: rate.cup_amount,
      customer_name: formData.value.name,
      customer_email: formData.value.email,
      status: 'completed',
      payment_method: 'credit_card',
      payment_details: {
        last4: paymentData.value.cardNumber.slice(-4),
        card_type: 'visa',
      }
    };

    // Guardar la recarga en Supabase
    const { data: savedRecharge, error: rechargeError } = await supabase
      .from('recargas')
      .insert([newRecharge])
      .select()
      .single();

    if (rechargeError) throw rechargeError;

    // Actualizar el estado local con los datos de la base de datos
    if (savedRecharge) {
      rechargeHistory.value = [savedRecharge, ...rechargeHistory.value];
    }
    
    currentView.value = 'success';
    
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    alert('Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.');
  } finally {
    isProcessing.value = false;
  }
};

function resetForm() {
  formData.value = { phone: '', name: '', email: '' };
  paymentData.value = { cardNumber: '', expiry: '', cvv: '', nameOnCard: '' };
  selectedRate.value = null;
  currentView.value = 'form';
}

const toggleHistory = () => {
  showHistory.value = !showHistory.value;
};

// Cargar historial al montar el componente
onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('recargas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (data) {
      rechargeHistory.value = data;
    }
  } catch (error) {
    console.error('Error al cargar el historial:', error);
  }
});

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    completed: 'Completada',
    failed: 'Fallida'
  };
  return statusMap[status] || status;
}
</script>
