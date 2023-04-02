import { ITodo } from "@/interface/todo";

export class TodoStorageManager {
  todo: ITodo[] = [];
  // constructor() {
  //   try {
  //     this.todo = this.getLocalTodo();
  //   } catch {}
  // }
  getLocalTodo(): ITodo[] {
    try {
      const jsonItem: string = sessionStorage.getItem("todo") || "[]";
      return JSON.parse(jsonItem) as ITodo[];
    } catch (error) {
      return [];
    }
  }

  updateStorage(items: ITodo[]) {
    sessionStorage.setItem("todo", JSON.stringify(items));
  }
}
