import { useState } from "react";
import type { FormEvent } from "react";
import { authenticate } from "../lib/api";

interface AuthProps {
  onAuthenticated: (token: string) => void;
}

function Auth({ onAuthenticated }: AuthProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    "w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-[#974fd0]";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const result = await authenticate(mode, {
        ...(mode === "register" ? { name: name.trim() } : {}),
        email: email.trim(),
        password,
      });

      onAuthenticated(result.token);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-12">
      <h1 className="text-3xl font-semibold">
        {mode === "login" ? "Welcome back" : "Create an account"}
      </h1>

      <p className="mt-3 text-gray-500">
        Sign in to save and search your tasks.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {mode === "register" && (
          <div>
            <label htmlFor="name" className="mb-2 block font-medium">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              maxLength={100}
              disabled={isSubmitting}
              className={inputClass}
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-2 block font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            maxLength={254}
            disabled={isSubmitting}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            minLength={mode === "register" ? 8 : undefined}
            disabled={isSubmitting}
            className={inputClass}
            required
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-[#974fd0] px-5 py-3 font-medium text-white hover:bg-[#803db7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Please wait..."
            : mode === "login"
              ? "Log in"
              : "Create account"}
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setPassword("");
            setError("");
          }}
          className="text-sm text-[#974fd0] underline"
        >
          {mode === "login"
            ? "New here? Create an account"
            : "Already registered? Log in"}
        </button>
      </form>
    </main>
  );
}

export default Auth;