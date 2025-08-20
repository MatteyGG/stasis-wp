"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notifySuccess = (message: string) =>
  toast.success(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

const notifyError = (message: string) =>
  toast.error(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

export default function CategoryList() {
  const [categories, setCategories] = useState<
    { id: number; name: string; createdAt: string }[] | undefined
  >();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetch("/api/category")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data);
        console.log(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    return () => {
      setRefresh(false);
    };
  }, [refresh]);

  const addCategory = async (name: string) => {
    if (!name) {
      return notifyError("Введите название категории");
    }

    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Category added:", result.name);
      notifySuccess(name);
      setShowForm(false);
      setRefresh(true);
    } catch (error) {
      console.error("Error adding category:", error);
      notifyError("Категория не добавлена");
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const response = await fetch(`/api/category/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Category deleted:", result.name);
      notifySuccess("Категория удалена");
      setShowForm(false);
      setRefresh(true);
    } catch (error) {
      console.error("Error deleting category:", error);
      notifyError("Категория не удалена");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="container overflow-y-scroll shadow-sm shadow-black mx-auto p-2 rounded-xl backdrop-blur-3xl">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {categories?.map((category, index) => (
            <li
              className="flex items-baseline bg-white rounded-md shadow-sm justify-between p-2"
              key={index}
            >
              <div className="w-full inline-flex justify-between">
                <div>
                  <p>{category.name}</p>
                </div>
                <div className="inline-flex gap-4 mr-4">
                  <p>
                    Создано:&nbsp;
                    {new Date(category.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </div>

              <div className="space-x-1">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl"
                  onClick={() => deleteCategory(category.id)}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl"
          onClick={() => setShowForm(true)}
        >
          Добавить категорию
        </button>
        {showForm && (
          <form
            className="w-1/2 mx-auto flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const nameElement = e.currentTarget.elements.namedItem("name") as HTMLInputElement;
              const name = nameElement.value;
              addCategory(name);
            }}
          >
            <label htmlFor="name">
              Название
              <input
                type="text"
                id="name"
                className="block w-full px-3 py-2 text-base text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl"
            >
              Добавить
            </button>
          </form>
        )}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

