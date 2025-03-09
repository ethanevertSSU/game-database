import Image from 'next/image';
import { Metadata } from 'next';
import Header from "@/components/Header";

export const metadata: Metadata = {
    title: 'User Profile | Game Database',
    description: 'View your gaming profile, top games, and achievements',
};

export default function ProfilePage() {
    // Placeholder user data
    const user = {
        id: '1',
        username: 'GamerX2024',
        avatarUrl: '/placeholder/150/150',  // Placeholder avatar
        joinedDate: '2022-03-15',
        level: 42,
        totalGamesPlayed: 127,
        totalAchievements: 384,
        bio: 'Avid gamer since 2010. I love RPGs, strategy games, and occasionally dabble in FPS games. Always looking for new gaming buddies!'
    };

    // Placeholder top games data
    const topGames = [
        {
            id: '1',
            title: 'Elden Ring',
            coverUrl: '/placeholder/120/160',
            playtime: 237,
            lastPlayed: '2024-02-28',
            platform: 'PC',
            rating: 5
        },
        {
            id: '2',
            title: 'The Witcher 3: Wild Hunt',
            coverUrl: '/placeholder/120/160',
            playtime: 189,
            lastPlayed: '2024-01-15',
            platform: 'PlayStation 5',
            rating: 5
        },
        {
            id: '3',
            title: 'Baldur\'s Gate 3',
            coverUrl: '/placeholder/120/160',
            playtime: 156,
            lastPlayed: '2024-02-10',
            platform: 'PC',
            rating: 5
        },
        {
            id: '4',
            title: 'Cyberpunk 2077',
            coverUrl: '/placeholder/120/160',
            playtime: 92,
            lastPlayed: '2023-12-20',
            platform: 'PC',
            rating: 4
        },
        {
            id: '5',
            title: 'Red Dead Redemption 2',
            coverUrl: '/placeholder/120/160',
            playtime: 88,
            lastPlayed: '2023-11-05',
            platform: 'Xbox Series X',
            rating: 5
        }
    ];

    // Placeholder achievements data
    const achievements = [
        {
            id: '1',
            title: 'Marathon Gamer',
            description: 'Played for 24 hours straight',
            unlockedDate: '2023-07-15',
            rarity: 'Rare',
            game: 'Elden Ring'
        },
        {
            id: '2',
            title: 'Completionist',
            description: 'Completed all side quests in a single game',
            unlockedDate: '2023-09-22',
            rarity: 'Legendary',
            game: 'The Witcher 3: Wild Hunt'
        },
        {
            id: '3',
            title: 'First Day Adopter',
            description: 'Played a game on its release day',
            unlockedDate: '2024-01-30',
            rarity: 'Common',
            game: 'Baldur\'s Gate 3'
        },
        {
            id: '4',
            title: 'Social Butterfly',
            description: 'Added 50 friends to your network',
            unlockedDate: '2023-11-05',
            rarity: 'Uncommon',
            game: 'Global'
        },
        {
            id: '5',
            title: 'Night Owl',
            description: 'Played between 2AM and 4AM',
            unlockedDate: '2024-02-18',
            rarity: 'Common',
            game: 'Cyberpunk 2077'
        }
    ];

    return (
        <div className="min-h-screen bg-purple-50">
            <Header/>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* User Profile Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Avatar and Stats */}
                        <div className="w-full md:w-1/3 flex flex-col items-center">
                            <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-purple-600">
                                <Image
                                    src={user.avatarUrl}
                                    alt={user.username}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-purple-900 mb-2">{user.username}</h2>
                            <p className="text-gray-600 mb-4">Member since {new Date(user.joinedDate).toLocaleDateString()}</p>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-xs text-center">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <p className="text-purple-800 font-bold text-xl">{user.level}</p>
                                    <p className="text-purple-600 text-sm">Level</p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <p className="text-purple-800 font-bold text-xl">{user.totalGamesPlayed}</p>
                                    <p className="text-purple-600 text-sm">Games</p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-lg col-span-2">
                                    <p className="text-purple-800 font-bold text-xl">{user.totalAchievements}</p>
                                    <p className="text-purple-600 text-sm">Achievements</p>
                                </div>
                            </div>
                        </div>

                        {/* Bio and Details */}
                        <div className="w-full md:w-2/3">
                            <h3 className="text-xl font-semibold text-purple-800 mb-2">About Me</h3>
                            <p className="text-gray-700 mb-6">{user.bio}</p>

                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-xl font-semibold text-purple-800 mb-4">Gaming Activity</h3>
                                <div className="bg-purple-100 rounded-lg p-4">
                                    <div className="h-32 w-full flex items-center justify-center">
                                        <p className="text-purple-700">Activity chart placeholder</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Games Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-purple-900 mb-4">Top 5 Games</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {topGames.map(game => (
                            <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                                <div className="relative h-40 w-full">
                                    <Image
                                        src={game.coverUrl}
                                        alt={game.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-purple-800 text-lg mb-1 truncate" title={game.title}>
                                        {game.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-2">{game.platform}</p>

                                    <div className="flex justify-between text-sm text-gray-700">
                                        <span>{game.playtime} hours</span>
                                        <span className="text-purple-600">
                      {"★".repeat(game.rating)}
                    </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Last played: {new Date(game.lastPlayed).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Achievements Section */}
                <div>
                    <h2 className="text-2xl font-bold text-purple-900 mb-4">Recent Achievements</h2>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {achievements.map((achievement, index) => (
                            <div
                                key={achievement.id}
                                className={`p-4 flex items-start gap-4 ${
                                    index < achievements.length - 1 ? 'border-b border-gray-200' : ''
                                }`}
                            >
                                <div className="bg-purple-200 rounded-full p-3 h-12 w-12 flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-700 text-xl">🏆</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-purple-800">{achievement.title}</h3>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            achievement.rarity === 'Common' ? 'bg-gray-200 text-gray-700' :
                                                achievement.rarity === 'Uncommon' ? 'bg-green-200 text-green-800' :
                                                    achievement.rarity === 'Rare' ? 'bg-blue-200 text-blue-800' :
                                                        'bg-purple-200 text-purple-800'
                                        }`}>
                      {achievement.rarity}
                    </span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{achievement.description}</p>
                                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                                        <span>{achievement.game}</span>
                                        <span>Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}