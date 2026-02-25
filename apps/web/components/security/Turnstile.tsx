"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface TurnstileHandle {
    reset: () => void;
}

interface TurnstileProps {
    siteKey: string;
    onVerify: (token: string) => void;
    options?: {
        action?: string;
        cData?: string;
        theme?: 'light' | 'dark' | 'auto';
    };
}

declare global {
    interface Window {
        turnstile: {
            render: (container: string | HTMLElement, options: any) => string;
            reset: (widgetId?: string) => void;
            remove: (widgetId?: string) => void;
            getResponse: (widgetId?: string) => string | undefined;
        };
        onloadTurnstileCallback: () => void;
    }
}

/**
 * Invisible Cloudflare Turnstile Component
 * 
 * Provides automated bot protection without interrupting the user experience.
 */
const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(({ siteKey, onVerify, options }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    useImperativeHandle(ref, () => ({
        reset: () => {
            if (window.turnstile && widgetIdRef.current) {
                console.log('[Turnstile] Manual reset triggered');
                window.turnstile.reset(widgetIdRef.current);
                onVerify(''); // Clear token on reset
            }
        },
    }));

    useEffect(() => {
        if (!siteKey) {
            console.warn('[Turnstile] No siteKey provided.');
            return;
        }

        const scriptId = 'cloudflare-turnstile-script';

        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }

        const renderTurnstile = () => {
            if (window.turnstile && containerRef.current && !widgetIdRef.current) {
                try {
                    widgetIdRef.current = window.turnstile.render(containerRef.current, {
                        sitekey: siteKey,
                        callback: (token: string) => {
                            console.log('[Turnstile] Token generated');
                            onVerify(token);
                        },
                        'error-callback': (err: any) => {
                            console.error('[Turnstile] Error:', err);
                            onVerify(''); // Clear token on error
                        },
                        'expired-callback': () => {
                            console.warn('[Turnstile] Token expired, resetting...');
                            if (window.turnstile && widgetIdRef.current) {
                                window.turnstile.reset(widgetIdRef.current);
                            }
                            onVerify('');
                        },
                        theme: options?.theme || 'dark',
                        action: options?.action,
                        cData: options?.cData,
                        size: 'invisible',
                    });
                } catch (e) {
                    console.error('[Turnstile] Render failed:', e);
                }
            }
        };

        const interval = setInterval(() => {
            if (window.turnstile) {
                renderTurnstile();
                clearInterval(interval);
            }
        }, 100);

        return () => {
            clearInterval(interval);
            if (widgetIdRef.current && window.turnstile) {
                // Just keep it alive for the page lifecycle
            }
        };
    }, [siteKey, onVerify, options]);

    return <div ref={containerRef} className="hidden" aria-hidden="true" />;
});

Turnstile.displayName = 'Turnstile';

export default Turnstile;
