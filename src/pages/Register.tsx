
import AuthForm from "@/components/AuthForm";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="py-4 px-4 border-b">
        <Link to="/" className="text-xl font-bold text-farm-green">FarmFeria</Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthForm type="register" />
        </div>
      </div>
    </div>
  );
};

export default Register;
