'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Ban, Mail } from 'lucide-react'

export default function BannedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-destructive/10 via-background to-background" />
      
      <Card className="max-w-md w-full relative z-10 border-destructive/30 bg-card/80 backdrop-blur-xl">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center">
            <Ban className="h-10 w-10 text-destructive" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">Account Suspended</h1>
          
          <p className="text-muted-foreground mb-6">
            Your account has been suspended due to a violation of our terms of service. 
            If you believe this is an error, please contact our support team.
          </p>
          
          <div className="space-y-3">
            <Button
              asChild
              variant="outline"
              className="w-full border-border/50"
            >
              <a href="mailto:support@mrcash.net">
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </a>
            </Button>
            
            <Link href="/">
              <Button variant="ghost" className="w-full text-muted-foreground">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
