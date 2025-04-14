import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [locationStatus, setLocationStatus] = useState('idle'); // idle, loading, success, error
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
    } else {
        console.error('CSRF token not found!');
    }
    
    
    const { data, setData, post, processing, errors } = useForm({
        _token: token.content,
        email: '',
        password: '',
        remember: false,
        gps_location: null,
        device_id: null,
    });

    // Generate device ID
    useEffect(() => {
        const generateDeviceId = () => {
            const nav = window.navigator;
            const screen = window.screen;
            const deviceIdParts = [
                nav.userAgent,
                screen.height,
                screen.width,
                screen.colorDepth,
                new Date().getTimezoneOffset()
            ];
            return btoa(deviceIdParts.join('|')).substring(0, 32);
        };

        setData('device_id', generateDeviceId());
    }, []);

    // Get geolocation
    useEffect(() => {
        if (navigator.geolocation) {
            setLocationStatus('loading');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const gpsLocation = `${position.coords.latitude},${position.coords.longitude}`;
                    setData('gps_location', gpsLocation);
                    setLocationStatus('success');
                },
                (error) => {
                    console.error("Error getting location:", error.message);
                    setLocationStatus('error');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
            setLocationStatus('error');
        }
    }, []);

    const submit = (e) => {
        e.preventDefault();
        // Update this to use the correct route name
        post(route('authCheck'), {
            onSuccess: () => {
                // Let Inertia handle the redirect instead of manual window location
                // The server will return a redirect response to /admin/dashboard
            },
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                        Welcome 
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please sign in to your account
                    </p>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <span className="block sm:inline">{errors.email || errors.password || 'Please correct the errors below'}</span>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center text-sm">
                        {locationStatus === 'loading' && <span className="text-gray-500">Detecting location...</span>}
                        {locationStatus === 'success' && <span className="text-green-600">Location detected</span>}
                        {locationStatus === 'error' && <span className="text-yellow-600">Location unavailable</span>}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {processing ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}