// src/vue-shims.d.ts

declare module "*.vue" {
    import { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  
  declare global {
    interface Navigator {
      hid?: HID; // Use the correct type for HID if available, or use any if type details are unknown
    }
  }