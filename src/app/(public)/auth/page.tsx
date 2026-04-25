import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import Link from "next/link"
import {PiCaretLeft} from "react-icons/pi"
import GoogleItem from "./components/google-item"

const Page = () => {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <Card className="w-[300px]">
                <CardHeader>
                    <CardTitle className="font-bold">Svtyv</CardTitle>
                    <CardDescription>Sign in to your account</CardDescription>
                    <Separator />
                </CardHeader>
                <CardContent>
                    <GoogleItem />
                </CardContent>
                <CardFooter>
                    <Link href="/" className="flex items-center gap-2 hover:cursor-pointer">
                        <Button variant="link">
                            <PiCaretLeft /> home
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </main>
    )
}

export default Page
