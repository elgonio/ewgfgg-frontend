import React from 'react';
import { PieChart, Pie, Label } from 'recharts';
import { Battle, characterIdMap, PlayedCharacter } from '../../app/state/types/tekkenTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

interface CharacterWinLossChartProps {
  battles: Battle[];
  selectedCharacterId: number;
  playerName: string;
  polarisId: string;
  playedCharacters?: Record<string, PlayedCharacter>;
}

const CharacterWinLossChart: React.FC<CharacterWinLossChartProps> = ({ 
  selectedCharacterId,
  // eslint-disable-next-line
  playerName,
  playedCharacters
}) => {
  // Return null if selectedCharacterId is null or undefined (but not 0)
  if (selectedCharacterId === null || selectedCharacterId === undefined) {
    return null;
  }

  // Get the character name from the ID
  const getCharacterName = (characterId: number): string => {
    return characterIdMap[characterId] || `Character ${characterId}`;
  };

  const selectedCharName = getCharacterName(selectedCharacterId);

  // Get data directly from playedCharacters
  const characterData = playedCharacters?.[selectedCharName];
  
  // Use data directly from the payload
  const totalWins = characterData?.wins || 0;
  const totalLosses = characterData?.losses || 0;
  const winRate = characterData?.characterWinrate.toFixed(1) || '0.0';

  const data = [
    { name: 'Wins', value: totalWins, fill: '#4ade80' },  // Green color
    { name: 'Losses', value: totalLosses, fill: '#f87171' }  // Red color
  ];

  const chartConfig = {
    wins: {
      label: 'Wins',
      color: '#4ade80'
    },
    losses: {
      label: 'Losses',
      color: '#f87171'
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Character Winrate</CardTitle>
        <CardDescription>Your overall winrate</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {winRate}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Win Rate
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CharacterWinLossChart;
