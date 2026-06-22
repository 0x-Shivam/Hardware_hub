"use client";

import { error } from "console";
import { useState } from "react";

const supabase = {
    from: (table: string) => ({
        insert: (data: any) => ({
            then: (callback: any) => callback ({ data:null, error:null })
    }),

    storage: {
        from: (bucket: string) => ({
            upload: (name:string, file: any) => ({
                then: (callback: any) => callback({ data: {publicUrl: 'https://example.com/image.jpg'} })
            })
        })
    }
}