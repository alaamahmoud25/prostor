'use client';
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {signUpDefaultValues} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signUpUser } from "@/lib/actions/user.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams} from "next/navigation";


const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: ''
  });
  const SearchParams = useSearchParams();
  const callbackUrl = SearchParams.get('callbackUrl') || '/';
  
  const SignUpButton = () => {
    const { pending } = useFormStatus();
    
    return (
      <Button disabled={pending} className="w-full" variant='default'>
        {pending ? 'Submitting...':'sign Up'}
      </Button>
    )
  }
  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
        
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="text"
          
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="confirmPassword"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>
        <div>
          <SignUpButton />
        </div>
        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        <div className="text-sm text-center text-muted-foregound">
          Already have an account?{' '}
          <Link href="/sign-in" target="_self" className="Link">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
}
 export default SignUpForm;