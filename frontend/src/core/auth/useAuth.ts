import { useMutation} from "@tanstack/react-query";
import {authServices} from "./services";
import {queryClient} from "../httpClient";

export const useLogin = () => {
    return useMutation({
        mutationFn: authServices.login,
        onSuccess: (userData) => console.log(`Usuario ${userData} logeado correctamente`),
        onError: (error) => console.error(`Error logeando ${error}`)
    }, queryClient);
};

export const useRegister = () =>
    useMutation({
        mutationFn: authServices.register,
        onSuccess: (userData) => console.log(`Usuario ${userData} registrado correctamente`),
        onError: (error) => console.error(`Error registrando ${error}`)
    }, queryClient);


export const useLogout = () => {
    return useMutation({
        mutationFn: authServices.logout,
        onSuccess: () => {
            queryClient.clear();
            window.location.href = '/login'
        },
    }, queryClient);
}

