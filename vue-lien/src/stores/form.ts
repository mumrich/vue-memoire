import { useIDBKeyval } from "@vueuse/integrations/useIDBKeyval";

export const formMemoire = useIDBKeyval("form", {
  name: "",
  email: "",
  select: null,
  checkbox: false,
});
