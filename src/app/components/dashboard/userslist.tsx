"use client";

/* eslint-disable @next/next/no-async-client-component */
import Image from "next/image";
import { useEffect, useState } from "react";
import React from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: string;
  gameID: number;
  username: string;
  email: string;
  created_at: Date;
  nation: string;
  army: string;
  rank: string;
  approved: boolean;
}

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

export default function Userlist() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checkedId = Number(event.target.value);
    if (event.target.checked) {
      setSelectedIds([...selectedIds, checkedId]);
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== checkedId));
    }
  };

  const handleApprove = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (selectedIds.length === 0) {
      return notifyError("Please select at least one user to approve");
    }
    try {
      const response = await fetch("/api/user_list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameID: selectedIds.toLocaleString(),
          approved: true,
        }),
      });
      if (!response.ok) {
        notifyError("Error approving users");
      } else {
        notifySuccess("Users approved successfully");
      }
    } catch (error) {
      console.error("Error approving users:", error);
      notifyError("Error approving users");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user_list", {
          method: "GET",
        });
        if (response) {
          const data = await response.json();
          console.log(data);
          setUsers(data.users);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <form>
        <h1>Loading...</h1>
      </form>
    );
  }

  return (
    <form className="container min-h-64 shadow-sm shadow-black mx-auto flex-col p-2 rounded-xl  backdrop-blur-3xl">
      <ul className="text-left grid gap-1 grid-cols-1  md:grid-cols-2 userlist  rounded-xl space-y-1">
        {Object.values(users).map((user, index) => {
          return (
            <li
              className="mx-auto w-full px-4 bg-white rounded-xl shadow-md md:max-w-2xl"
              key={index}
            >
              <div className="flex items-center p-6 pb-1">
                <Image
                  className="rounded-md z-10 w-20 md:w-40 h-full hover:translate-x-1/2 hover:grow hover:shadow-lg hover:scale-[2.3]  transition-all delay-100 duration-500"
                  src={
                    "/userScreen/" + "userScreen_" + user.id + ".png"
                  }
                  alt=""
                  width={1000}
                  height={1000}
                />
                <div className="ml-6 w-1/2">
                  <h2
                    className={`w-full ${user.rank} text-xl font-semibold rounded-md p-1`}
                  >
                    <select
                      className={` bg-transparent text-xl font-semibold rounded-md p-1`}
                      defaultValue={user.rank?.toString() ?? ""}
                      onChange={async (e) => {
                        const response = await fetch("/api/user_list", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            id: user.id,
                            rank: e.target.value,
                          }),
                        });
                        if (!response.ok) {
                          notifyError("Error");
                        } else {
                          notifySuccess("Success");
                        }
                      }}
                    >
                      <option value="R1">R1</option>
                      <option value="R2">R2</option>
                      <option value="R3">R3</option>
                      <option value="officer">Officer</option>
                    </select>
                    {user.username}
                  </h2>

                  <p className="text-gray-500">
                    Создан:{" "}
                    {new Date(user.created_at).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="w-full text-nowrap text-gray-500">
                    Почта: {user.email}
                  </p>
                  <p className="w-full text-nowrap text-gray-500">
                    Игровой ID: {user.gameID}
                  </p>
                  {user.approved ? (
                    <p className="w-full text-nowrap text-green-500">
                      Подтвержден
                    </p>
                  ) : (
                    <p className="w-full text-nowrap text-red-500">
                      Не подтвержден
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between p-4 pt-1">
                <div className="flex flex-row">
                  <Image
                    src={"/source/nation/" + user.nation + ".webp"}
                    height={48}
                    width={48}
                    alt=""
                  />
                  <Image
                    src={"/source/army/" + user.army + ".webp"}
                    height={48}
                    width={48}
                    alt=""
                  />
                </div>
                <label className="flex cursor-pointer select-none items-center gap-2">
                  <div className="relative ">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(Number(user.gameID))}
                      value={user.gameID}
                      onChange={(event) => {
                        handleCheckboxChange(event);
                      }}
                      className={`sr-only peer`}
                    />
                    <div
                      className={`block h-8 w-14 rounded-full bg-red-500 peer-checked:bg-green-500 `}
                    ></div>
                    <div className="dot flex transition ease-in-out duration-300 delay-150 translate-x-0  peer-checked:translate-x-6  absolute left-1 top-1  h-6 w-6 items-center justify-center rounded-full bg-white">
                      {!selectedIds.includes(Number(user.gameID)) ? (
                        <span>
                          <svg
                            className="h-4 w-4 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </span>
                      ) : (
                        <span>
                          <svg
                            width="11"
                            height="8"
                            viewBox="0 0 11 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                              fill="black"
                              stroke="black"
                              strokeWidth="0.4"
                            ></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </li>
          );
        })}
      </ul>
      <div>{selectedIds.join(", ")}</div>
      <button
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl"
        onClick={handleApprove}
      >
        Подтвердить
      </button>
    </form>
  );
}

