import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"하루운동 · 나의 운동 기록",description:"매일의 걷기, 달리기, 근력 운동, 자전거를 기록하고 오늘의 운동을 한눈에 확인하세요.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ko"><body>{children}</body></html>;}
