'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { USERS } from '@/lib/mockData';
import { UserRole } from '@/lib/mockData';
import { BookOpen, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState<UserRole>('student');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            // Simple mock mock auth
            const user = USERS.find(u => u.role === selectedRole); // Just get the first user of this role for MVP
            if (user) {
                // In real app, we would set a cookie/token here
                console.log('Logged in as:', user);
                navigate(`/${selectedRole}`);
            } else {
                alert('Invalid credentials');
            }
            setLoading(false);
        }, 1000);
    };

    const roles = [
        { id: 'student', label: 'Student', icon: BookOpen },
        { id: 'parent', label: 'Parent', icon: Users },
        { id: 'admin', label: 'Admin', icon: Shield },
    ] as const;

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md space-y-4">
                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-3xl font-bold tracking-tighter text-primary">HomeSchool</h1>
                    <p className="text-muted-foreground">Interactive Learning Platform for Class 6-12</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Welcome back</CardTitle>
                        <CardDescription>Select your role to continue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            {roles.map((role) => {
                                const Icon = role.icon;
                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all",
                                            selectedRole === role.id
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-transparent hover:bg-muted text-muted-foreground"
                                        )}
                                    >
                                        <Icon className="h-6 w-6 mb-2" />
                                        <span className="text-xs font-medium">{role.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    // For demo, prepopulate based on role if empty
                                    onFocus={() => {
                                        if (!email) {
                                            const demoUser = USERS.find(u => u.role === selectedRole);
                                            if (demoUser) setEmail(demoUser.email);
                                        }
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <Input type="password" placeholder="••••••••" defaultValue="password" />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Signing in...' : `Sign in as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center text-xs text-muted-foreground">
                        Demo: Click email field to auto-fill
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}
