'use client';
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {signInDefaultValues} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams} from "next/navigation";


const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: ''
  });
  const SearchParams = useSearchParams();
  const callbackUrl = SearchParams.get('callbackUrl') || '/';
  
  const SignInButton = () => {
    const { pending } = useFormStatus();
    
    return (
      <Button disabled={pending} className="w-full" variant='default'>
        {pending ? 'signing In...':'sign In'}
      </Button>
    )
  }
  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email" >Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
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
            defaultValue={signInDefaultValues.password}
          />
        </div>
        <div>
        <SignInButton/>
        </div>
        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        <div className="text-sm text-center text-muted-foregound">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" target='_self' className="Link">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
}
 export default CredentialsSignInForm;