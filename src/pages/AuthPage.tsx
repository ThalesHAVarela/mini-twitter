import { useState } from "react";
import { z} from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
    email: z.string().email ('Email inválido'),
    password: z.string().min(6, 'Senha precisa ter pelo menos 6 caracteres'),
})

const registerSchema = z.object({
    name: z.string().min (1,'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha precisa ter pelo menos 6 caracteres')
})



function AuthPage(){

    const navigate = useNavigate()

    const onSubmit = async (data: any) => {
        try{
            const response = await api.post('/auth/login', data)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            navigate('/feed')
            console.log(response.data)
        }catch{
            setErro('Email ou senha errados')
        }
    }

    const onRegister = async (data: any) => {
        try{
            const response = await api.post('/auth/register', data)
            localStorage.setItem('token',response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            navigate('/feed')
            console.log(response.data)
        }catch{
            setErro('Esse email já está em uso.')
        }
    }

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(loginSchema)
    })

    const { register:registerField, handleSubmit: handleRegister, formState: { errors:registerErrors}, reset: resetRegister} = useForm({
        resolver: zodResolver(registerSchema)
    })

    const [abaAtiva, setAbaAtiva] = useState('login')

    const [erro, setErro] = useState('')
    const [erroS, setErroS] = useState('')

    return(
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-lg w-96 flex flex-col items-center ">
                <h1 className="text-white text-4xl font-bold text-center mb-6 " >Mini twitter</h1>
                <div className="flex justify-center gap-8 mb-6 w-full">
                    <button className={abaAtiva === 'login' ? 'text-white border-b-2 border-blue-500': 'text-gray-400  '} onClick={()=> {setAbaAtiva('login'); setErro(''); setErroS(''); resetRegister() }}>Login</button>
                    <button className={abaAtiva === 'cadastrar' ? 'text-white border-b-2 border-blue-500 ': 'text-gray-400 '} onClick={() =>{ setAbaAtiva('cadastrar'); setErro(''); setErroS(''); reset() }}>Cadastrar</button>
                </div>
                             
                {abaAtiva === 'login' ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h3 className="text-white text-2xl font-bold">Olá, de novo !</h3>
                        <p className="text-white text-sm mb-6"> Por favor, insira seus dados para fazer login </p>
                        <label className="text-white text-sm mb-1 block">Email:</label>
                        <input {...register('email')} className="bg-gray-700 text-white rounded-lg p-3 mb-4 border border-gray-600 w-full" type="email" placeholder="Insira o seu email"/>
                        <label className="text-white text-sm mb-1 block">Senha:</label>
                        <input {...register('password')} className="bg-gray-700 text-white rounded-lg p-3 mb-4 border border-gray-600 w-full" type="password" placeholder="Insira a sua senha"/>
                        <button className="w-full bg-blue-500 text-white rounded-lg p-3 mt-2" type="submit" >Entrar </button>
                    </form>
                ) : <form onSubmit={handleRegister(onRegister)}>
                        <h3 className="text-white text-2xl font-bold">Olá, vamos começar !</h3>
                        <p className="text-white text-sm mb-6">Por favor,insira os dados solicitados para fazer o cadastro</p>
                        <label className="text-white text-sm mb-1 block">Nome:</label>
                        <input {...registerField('name')} className="text-white bg-gray-700 rounded-lg p-3 mb-4 border border-gray-600 w-full" type="text" placeholder="Insira o seu nome"/>
                        <label className="text-white text-sm mb-1 block">Email:</label>
                        <input {...registerField('email')} className="text-white bg-gray-700 rounded-lg p-3 mb-4 border border-gray-600 w-full" type="email" placeholder="Insira o seu email"/>
                        <label className="text-white text-sm mb-1 block">Senha:</label>
                        <input {...registerField('password')} className="text-white bg-gray-700 rounded-lg p-3 mb-4 border border-gray-600 w-full" type="password" placeholder="Insira a sua senha"/>
                        <button className="w-full bg-blue-500 text-white rounded-lg p-3 mt-2" type="submit"> Cadastrar </button>
                    </form>
                }
                {erro && <p className="text-red-500 text-sm mt-6" > {erro} </p>}
                {erroS && <p className="text-red-500 text-sm mt-6" > {erroS} </p>}
            </div>
        </div>    
    )
}
export default AuthPage