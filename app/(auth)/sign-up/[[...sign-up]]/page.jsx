import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <SignUp
                appearance={{
                    elements: {
                        formButtonPrimary: 'bg-primary hover:bg-primary/90',
                        footerActionLink: 'text-primary hover:text-primary/90'
                    }
                }}
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                afterSignUpUrl="/"
                initialValues={{
                    firstName: "",
                    lastName: "",
                }}
                fields={{
                    firstName: {
                        label: "First name",
                        placeholder: "Enter your first name",
                        required: true,
                    },
                    lastName: {
                        label: "Last name",
                        placeholder: "Enter your last name",
                        required: true,
                    },
                }}
            />
        </div>
    );
}