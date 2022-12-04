import { VStack, useToast, HStack } from 'native-base';
import { Header } from '../components/Header';
import { useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react';
import { Loading } from '../components/Loading';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';
import { api } from '../services/api';
import { PoolCardPros } from '../components/PoolCard'
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Share } from 'react-native'


interface RouteParams {
    id: string;
}
export function Details() {

    const [isLoading, setIsLoading] = useState(true);
    const [optionSelected, setOptionSelected] = useState<'Palpites' | 'Ranking'>('Palpites')
    const [poolDetails, setPoolDetails] = useState<PoolCardPros>({} as PoolCardPros);
    const route = useRoute();
    const toast = useToast();
    const { id } = route.params as RouteParams;


    async function fetchPoolDetails() {

        try {
            setIsLoading(true);

            const response = await api.get(`/pools/${id}`);
            setPoolDetails(response.data.pool)

        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Não foi possível carregar os detalhes do bolão!',
                placement: 'top',
                bgColor: 'red.500'
            });

        } finally {
            setIsLoading(false);
        }
    }

    async function handleCodeShare() {
        await Share.share({
            message: `Estou te convidando para participar do Bolão: *${poolDetails.title}* bastar entrar usando o código: *${poolDetails.code}*`
        });
    }

    useEffect(() => {
        fetchPoolDetails();
    }, [id]);


    if (isLoading) {
        return (
            <Loading />
        );
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header
                title={poolDetails.title}
                showBackButton
                showShareButton
                onShare={handleCodeShare}
            />

            {
                poolDetails._count?.participants > 0 ?
                    <VStack px={5} flex={1}>
                        <PoolHeader data={poolDetails} />

                        <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                            <Option
                                title="Seus Palpites"
                                isSelected={optionSelected === 'Palpites'}
                                onPress={() => setOptionSelected('Palpites')}
                            />
                            <Option
                                title="Ranking do grupo"
                                isSelected={optionSelected === 'Ranking'}
                                onPress={() => setOptionSelected('Ranking')}
                            />
                        </HStack>

                        <Guesses poolId={poolDetails.id} code={poolDetails.code}/>
                    </VStack>
                    : <EmptyMyPoolList code={poolDetails.code} />
            }
        </VStack>
    );
}