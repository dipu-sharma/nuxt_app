import { defineStore } from "pinia";

export const useProjectStore = defineStore("project", {
  state: () => ({
    project_payload: {
      system_info: null,
      project_info: null,
    },
    save_for_planning: [],
  }),
  actions: {
    SaveProjectInfo(payload: any) {
      this.project_payload.project_info = payload;
    },
    SaveProjectSystem(payload: any) {
      this.project_payload.system_info = payload;
    },
    SaveForPlanning(payload: any) {

      this.save_for_planning = payload;
    },

    Reset() {
      this.save_for_planning = [];
    },
  },
});
