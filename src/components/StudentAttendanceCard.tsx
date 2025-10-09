import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import React from 'react'

const StudentAttendanceCard = async ({ id }: { id: string }) => {
    const attendance = await prisma.attendance.findMany({
        where: {
            studentId: id,
            date: {
                gte: new Date(new Date().getFullYear(), 0, 1),
            }
        }
    })
    const totalDays = attendance.length
    const presentDays = attendance.filter(item => item.present).length
    const percentage = totalDays && presentDays ? ((presentDays / totalDays) * 100).toFixed(2) : 0


    return (
        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
            <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
            />
            <div className="">

                <h1 className="text-xl font-semibold">{percentage ?? 0}%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
            </div>
        </div>
    )
}

export default StudentAttendanceCard