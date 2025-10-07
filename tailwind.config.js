/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
	  "./components/**/*.{js,ts,jsx,tsx,mdx}",
	  "./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
	  extend: {
		animation: {
		  'star-movement-bottom': 'star-movement-bottom 7s linear infinite alternate',
		  'star-movement-top': 'star-movement-top 9s linear infinite alternate',
		},
          keyframes: {
            'star-movement-bottom': {
              '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
              '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
            },
            'star-movement-top': {
              '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
              '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
            },
            'spin-slow': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
            'spin-slow-reverse': {
              '0%': { transform: 'rotate(360deg)' },
              '100%': { transform: 'rotate(0deg)' },
            },
          },
          animation: {
            'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
            'star-movement-top': 'star-movement-top linear infinite alternate',
            'spin-slow': 'spin-slow 20s linear infinite',
            'spin-slow-reverse': 'spin-slow-reverse 25s linear infinite',
          },
          scale: {
            '102': '1.02',
          },
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		colors: {
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		  primary: {
			DEFAULT: "hsl(var(--primary))", // deep red
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))", // dark gray
			foreground: "hsl(var(--secondary-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))", // subtle red accent
			foreground: "hsl(var(--accent-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  chart: {
			"1": "hsl(var(--chart-1))",
			"2": "hsl(var(--chart-2))",
			"3": "hsl(var(--chart-3))",
			"4": "hsl(var(--chart-4))",
			"5": "hsl(var(--chart-5))",
		  },
		},
		fontFamily: {
		  body: ["var(--font-general-sans)", "sans-serif"],
		  heading: ["var(--font-space-grotesk)", "sans-serif"],
		  highlight: ["var(--font-playfair)", "serif"],
		},
		backgroundImage: {
			"hero-gradient":
			  // Layered cinematic radial gradients
			  "radial-gradient(58% 50% at 50% 30%, hsl(var(--primary)/0.25) 0%, transparent 65%), " +
			  "radial-gradient(88% 70% at 50% 42%, hsl(var(--primary)/0.15) 0%, transparent 78%), " +
			  "radial-gradient(32% 28% at 50% 34%, hsl(var(--foreground)/0.08) 0%, transparent 60%), " +
			  "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(40,0,15,0.8) 50%, rgba(180,20,20,0.12) 100%)",
			"hero-vignette":
			  "radial-gradient(95% 95% at 50% 45%, transparent 60%, rgba(0,0,0,0.88) 100%)",
		  },
		  
		boxShadow: {
		  'hero-glow': '0 0 28px rgba(255, 0, 20, 0.45), 0 0 56px rgba(255, 0, 20, 0.2)',
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };
  