import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { userAtom } from '../../atoms/authAtom';
import { loginUser } from '../../api/api';
import { useToast } from "../../hooks/use-toast"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card"

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useSetAtom(userAtom);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await loginUser(username, '', password);
      setUser(user);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <div className='flex w-full justify-end' >
        <Link to={'/signup'}>
        <span>SignUp</span>
        </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

       