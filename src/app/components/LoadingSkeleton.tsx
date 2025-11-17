import { useTheme } from '@/app/contexts/ThemeContext';

interface LoadingSkeletonProps {
  count?: number;
  variant?: 'card' | 'list' | 'text';
}

export default function LoadingSkeleton({ count = 3, variant = 'card' }: LoadingSkeletonProps) {
  const { theme } = useTheme();
  const variants = {
    card: 'rounded-2xl h-20',
    list: 'rounded-full h-16',
    text: 'rounded-lg h-4',
  };
  return (
    <div className="w-full space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse ${variants[variant]} ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}
