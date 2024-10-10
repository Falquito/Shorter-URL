import {z} from 'zod'
const UrlSchema = z.object({
    url:z.string()
})

export const ValidarUrl=(url)=>{
    return UrlSchema.safeParse({url})
}
