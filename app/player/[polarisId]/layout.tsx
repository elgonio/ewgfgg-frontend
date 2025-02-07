import { Metadata } from 'next'
import { characterIconMap, rankIconMap, Regions, PlayerMetadata } from '@/app/state/types/tekkenTypes'

type Props = {
  params: { polarisId: string }
  children: React.ReactNode
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // Fetch player data
  const response = await fetch(`${process.env.API_URL}/player-stats/metadata/${params.polarisId}`)
  const playerData: PlayerMetadata = await response.json()

  if (!playerData) {
    return {
      title: 'Player Not Found',
      description: 'The requested player profile could not be found.'
    }
  }

  const playerName = playerData.playerName ? `${playerData.polarisId}` : ''
  const mainChar = playerData.mainCharacterAndRank?.characterName || ''
  const rank = playerData.mainCharacterAndRank?.danRank || ''
  const region = playerData.regionId !== undefined ? Regions[playerData.regionId] : ''
  const area = playerData.areaId ? `${playerData.areaId}` : ''
  const polarisId = playerData.polarisId ? `${playerData.polarisId}` : ''
  const characterIcon = characterIconMap[mainChar] || ''
  const rankIcon = rankIconMap[rank] || ''
  
  const title = `${playerName}'s Tekken 8 Profile`
  const description = `Tekken-ID: ${polarisId}'s Tekken 8 Stats\n🥋 Main: ${mainChar}\n👑 Rank: ${rank}\n🌎 Region: ${region} ${area}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: [characterIcon, rankIcon],
      siteName: 'EWGF.GG',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [characterIcon],
    }
  }
}

export default function PlayerLayout({ children }: Props) {
  return children
}
