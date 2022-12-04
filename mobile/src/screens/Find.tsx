import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState('');
    const toast = useToast();
    const { navigate } = useNavigation();
    async function handleJoinPool() {
        try {
            setIsLoading(true)
            await api.post('/pools/join', { code });
            toast.show({
                title: 'Você entrou no bolão com sucesso',
                placement: 'top',
                bgColor: 'red.500'
            });
            navigate('pools')
            if (!code.trim()) {
                return toast.show({
                    title: 'Código do bolão não informado',
                    placement: 'top',
                    bgColor: 'red.500'
                });
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
            if (error.response?.data?.message === 'Bolão não encontrado!') {
                return toast.show({
                    title: 'Bolão não encontrado!',
                    placement: 'top',
                    bgColor: 'red.500'
                });
            }
            if (error.response?.data?.message === 'Você já está inscrito nesse bolão!') {
                return toast.show({
                    title: 'Você já está inscrito nesse bolão!',
                    placement: 'top',
                    bgColor: 'red.500'
                });
            }
            toast.show({
                title: 'Erro desconhecido: Não foi possível entrar nesse bolão!',
                placement: 'top',
                bgColor: 'red.500'
            });
        }
    }
    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar por código" showBackButton />

            <VStack mt={8} mx={5} alignItems="center">
                <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
                    Encontrar um bolão através de {"\n"}
                    seu código único
                </Heading>
                <Input
                    mb={2}
                    placeholder="Qual o código do bolão?"
                    autoCapitalize="characters"
                    onChangeText={setCode}
                />
                <Button
                    title="BUSCAR BOLÃO"
                    isLoading={isLoading}
                    onPress={handleJoinPool}
                />
            </VStack>
        </VStack>
    );
}