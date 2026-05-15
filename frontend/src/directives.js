export default {
    mounted(el, binding) {
      const clickOutsideHandler = (event) => {
        // Jika klik terjadi pada elemen sendiri atau elemen dengan atribut "data-ignore-outside-click"
        if (el.contains(event.target) || event.target.dataset.ignoreOutsideClick) {
          return;
        }
        binding.value(event);
      };
  
      el.__vueClickOutside__ = clickOutsideHandler;
      document.addEventListener("click", clickOutsideHandler);
    },
    beforeUnmount(el) {
      document.removeEventListener("click", el.__vueClickOutside__);
      el.__vueClickOutside__ = null;
    },
  };
  