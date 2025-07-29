import { ref } from 'vue'

export function useModal() {
  const showModal = ref(false)
  const modalData = ref(null)

  const openModal = (data = null) => {
    modalData.value = data
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    modalData.value = null
  }

  const toggleModal = () => {
    if (showModal.value) {
      closeModal()
    } else {
      openModal()
    }
  }

  return {
    showModal,
    modalData,
    openModal,
    closeModal,
    toggleModal
  }
}
