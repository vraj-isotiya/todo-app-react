import { useEffect, useState } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api/todo.api";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTodos();
  }, []);
  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [error]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getTodos();
      setTodos(data);
    } catch (err) {
      setError("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!task.trim()) {
      setError("Task cannot be empty");
      return;
    }

    try {
      setError("");
      const { data } = await createTodo({ text: task });
      setTodos((prev) => [data, ...prev]);
      setTask("");
    } catch (err) {
      const msg =
        err.response?.data?.details?.[0] ||
        err.response?.data?.message ||
        "Failed to add todo";
      setError(msg);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch {
      setError("Failed to delete todo");
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      setError("");
      const { data } = await updateTodo(todo._id, {
        completed: !todo.completed,
      });

      setTodos((prev) => prev.map((t) => (t._id === data._id ? data : t)));
    } catch {
      setError("Failed to update todo");
    }
  };

  const handleEditClick = (todo) => {
    setEditingTodoId(todo._id);
    setEditingText(todo.text);
  };

  const handleSaveEdit = async (id) => {
    if (!editingText.trim()) {
      setError("Task cannot be empty");
      return;
    }

    try {
      setError("");
      const { data } = await updateTodo(id, { text: editingText });

      setTodos((prev) => prev.map((t) => (t._id === data._id ? data : t)));

      setEditingTodoId(null);
      setEditingText("");
    } catch (err) {
      const msg =
        err.response?.data?.details?.[0] ||
        err.response?.data?.message ||
        "Failed to update todo";
      setError(msg);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Todo App dev
        </h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={task}
            placeholder="Enter your task..."
            onChange={(e) => setTask(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
          />

          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>
        {error && (
          <div className="mb-4 flex items-start justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <span className="flex-1">{error}</span>
          </div>
        )}

        {loading && <p className="text-center">Loading...</p>}

        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex justify-between items-center bg-gray-50 border rounded-lg p-3"
            >
              {editingTodoId === todo._id ? (
                <div className="flex w-full gap-2">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-1"
                  />
                  <button
                    onClick={() => handleSaveEdit(todo._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo)}
                    />
                    <span
                      className={
                        todo.completed ? "line-through text-gray-400" : ""
                      }
                    >
                      {todo.text}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {!todo.completed && (
                      <button
                        onClick={() => handleEditClick(todo)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded-lg"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default App;
