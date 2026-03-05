// components
import LoginForm from "./LoginForm";

export default function LoginContainer() {
  return (
    <main className="bg-primary flex flex-1 flex-col items-center justify-center p-4">
      <div className="flex h-75 max-w-125 flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-8">
        <h1 className="text-primary-dark text-h3 mb-6 text-center font-bold">ADMIN ACCESS</h1>
        <LoginForm />
      </div>
    </main>
  );
}
