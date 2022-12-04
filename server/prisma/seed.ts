import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


async function main() {
    //criação do usuário
    const user = await prisma.user.create({
        data: {
            name: 'Fulano da Silva',
            email: 'fulanodasilva@gmail.com',
            avatarUrl: 'https://github.com.magdsilva.png',
        }
    })
    //Criação do bolão
    const pool = await prisma.pool.create({
        data: {
            title: 'bolao001',
            code: 'BOL123',
            ownerId: user.id,

            //Vinculação do usuário criador do bolão como participante do bolão.
            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })
    //Criação do jogo sem palpite
    const game = await prisma.game.create({
        data: {
            date: '2022-11-15T12:00:00.201Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'DE',
        }
    })
    //Criação do jogo com palpite
    await prisma.game.create({
        data: {
            date: '2022-11-16T12:00:00.201Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamPints: 2,
                    secondTeamPoints: 1,

                    partipant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id,
                            }
                        }
                    }
                }
            }
        }
    })
}

main()