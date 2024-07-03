"use client"

import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const generateNumber = (): number => {
  const primes = [2, 2, 2, 2, 3, 3, 3, 5, 5, 7]
  let number = 1
  while (number === 1 || number > 240) {
    number = primes
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 5) + 1)
      .reduce((a, b) => a * b, 1)
  }
  return number
}

const getPrimeFactorization = (num: number): number[] => {
  if (num === 1) return [1]
  const primes = [2, 3, 5, 7]
  let factorization: number[] = []
  let temp = num
  
  for (let prime of primes) {
    while (temp % prime === 0) {
      factorization.push(prime)
      temp /= prime
    }
    if (temp === 1) break
  }
  
  return factorization
}

const generateAllFactors = (primeFactors: number[]): number[] => {
  const factors = new Set<number>([1])
  
  const backtrack = (index: number, current: number) => {
    if (index === primeFactors.length) {
      factors.add(current)
      return
    }
    
    backtrack(index + 1, current)
    backtrack(index + 1, current * primeFactors[index])
  }
  
  backtrack(0, 1)
  return Array.from(factors).sort((a, b) => a - b)
}

const isPrime = (n: number): boolean => {
  return [2, 3, 5, 7].includes(n)
}

const PrimeFactorizationGame: React.FC = () => {
  const [number, setNumber] = useState<number>(generateNumber)
  const [input, setInput] = useState<string>('')
  const [factors, setFactors] = useState<number[]>([])
  const [message, setMessage] = useState<string>('')
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [allFactors, setAllFactors] = useState<number[]>([])
  const [primeFactorization, setPrimeFactorization] = useState<number[]>([])

  useEffect(() => {
    const primeFactors = getPrimeFactorization(number)
    setPrimeFactorization(primeFactors)
    const validFactors = generateAllFactors(primeFactors)
    setAllFactors(validFactors)
  }, [number])

  const checkFactor = (factor: number, inputParts: string[]): boolean => {
    if (!allFactors.includes(factor)) return false

    if (inputParts.length === 1) {
      return factor === 1 || isPrime(factor)
    }

    return inputParts.every(part => isPrime(parseInt(part, 10)))
  }

  const handleSubmit = () => {
    let factor: number
    const inputParts = input.split('*').map(part => part.trim())
    try {
      factor = inputParts.reduce((acc, part) => {
        const num = parseInt(part, 10)
        if (isNaN(num)) throw new Error(`Invalid number: ${part}`)
        return acc * num
      }, 1)
    } catch (error) {
      setMessage('Invalid input. Please enter a product of prime numbers or 1.')
      return
    }

    if (isNaN(factor)) {
      setMessage('Invalid input. Please enter a product of prime numbers or 1.')
    } else if (checkFactor(factor, inputParts)) {
      if (factors.includes(factor)) {
        setMessage('You already found this factor. Try another one.')
      } else {
        const newFactors = [...factors, factor]
        setFactors(newFactors)
        setInput('')
        
        if (newFactors.length === allFactors.length) {
          setIsComplete(true)
          setMessage('Congratulations! You found all the factors.')
        } else {
          setMessage('Correct! Keep going.')
        }
      }
    } else {
      setMessage('Invalid factor. Enter a product of prime numbers or 1.')
    }
  }

  const startNewGame = () => {
    setNumber(generateNumber())
    setFactors([])
    setIsComplete(false)
    setMessage('')
    setInput('')
  }

  const renderFactorization = (num: number) => {
    if (isPrime(num) || num === 1) {
      return null
    }
    const factorization = getPrimeFactorization(num)
    return <span className="text-muted-foreground"> ({factorization.join(' × ')})</span>
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Prime Factorization Game</h1>
      <p className="mb-4">
        Find all factors of: <span className="font-bold">{number}</span>
        {renderFactorization(number)}
      </p>
      <div className="mb-4">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a factor (e.g., 1, 2*5 or 7)"
          className="w-full p-2 border rounded mb-2"
          disabled={isComplete}
        />
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={isComplete}
        >
          Submit Factor
        </Button>
      </div>
      {message && (
        <Alert className="mb-4" variant={isComplete ? "default" : "destructive"}>
          {isComplete ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{isComplete ? "Completion" : "Status"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Factors Found:</h2>
        <ul className="list-disc list-inside">
          {factors.map((factor, index) => (
            <li key={index}>
              {factor}
              {renderFactorization(factor)}
            </li>
          ))}
        </ul>
      </div>
      {isComplete && (
        <Button
          onClick={startNewGame}
          className="w-full bg-green-500 hover:bg-green-600 mb-4"
        >
          Start New Game
        </Button>
      )}
    </div>
  )
}

export default PrimeFactorizationGame