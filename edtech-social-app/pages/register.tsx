// edtech-social-app/pages/register.tsx

import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import useAuthStore from "../zustand/store/authStore"
import Image from "next/image"

const Register = () => {
  const [first_name, setFirstName] = useState("")
  const [last_name, setLastName] = useState("")
  const [icon, setIcon] = useState("")
  const { register, loggedIn } = useAuthStore()
  const router = useRouter()

  const icons = [
    { name: "Bear", image: "/Icons/Bear.png" },
    { name: "Cat", image: "/Icons/Cat.png" },
    { name: "Cheeta", image: "/Icons/Cheeta.png" },
    { name: "Cow", image: "/Icons/Cow.png" },
    { name: "Crocodile", image: "/Icons/Crocodile.png" },
    { name: "Dog", image: "/Icons/Dog.png" },
    { name: "Hamster", image: "/Icons/Hamster.png" },
    { name: "Jaguar", image: "/Icons/Jaguar.png" },
    { name: "Penguin", image: "/Icons/Penguin.png" },
    { name: "Sloth", image: "/Icons/Sloth.png" },
    { name: "Turtle", image: "/Icons/Turtle.png" },
    { name: "Walrus", image: "/Icons/Walrus.png" },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await register(first_name, last_name, icon)
  }

  useEffect(() => {
    if (loggedIn) {
      router.push("/") // Redirect to home page upon successful registration and login
    }
  }, [loggedIn, router])

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-gray-700"
          >
            First Name:
          </label>
          <input
            type="text"
            id="first_name"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name:
          </label>
          <input
            type="text"
            id="last_name"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {icons.map((iconOption) => (
            <button
              key={iconOption.name}
              type="button"
              className={`border-2 p-2 ${
                icon === iconOption.name ? "border-blue-500" : "border-gray-200"
              } transform cursor-pointer rounded-lg transition duration-200 hover:border-gray-400`}
              onClick={() => setIcon(iconOption.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setIcon(iconOption.name)
                }
              }}
            >
              <Image
                src={iconOption.image}
                alt={iconOption.name}
                width={48}
                height={48}
              />
              <span className="text-center text-xs">{iconOption.name}</span>
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Register
        </button>
      </form>
    </div>
  )
}

export default Register
