// src/services/lawDiffService.ts

import { DiffLine, ArticleChange, ChangeType } from '@/types'

/**
 * Представя един член от закон
 */
export interface Article {
  number: string
  title: string
  content: string[]  // Редове в членa
}

/**
 * Представя версия на закон
 */
export interface LawVersion {
  id: string
  number: string
  date: string
  articles: Article[]
}

/**
 * Longest Common Subsequence (LCS) алгоритъм за намиране на общи части
 */
function longestCommonSubsequence(text1: string[], text2: string[]): number[][] {
  const m = text1.length
  const n = text2.length
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  return dp
}

/**
 * Генерира diff между два текста (масиви от редове)
 */
function generateDiff(oldLines: string[], newLines: string[]): DiffLine[] {
  const dp = longestCommonSubsequence(oldLines, newLines)
  const diff: DiffLine[] = []
  let i = oldLines.length
  let j = newLines.length
  let lineNumber = 1

  // Backtrack през LCS матрицата
  const changes: Array<{ type: ChangeType | 'unchanged'; oldIndex?: number; newIndex?: number }> = []
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      changes.unshift({ type: 'unchanged', oldIndex: i - 1, newIndex: j - 1 })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      changes.unshift({ type: 'added', newIndex: j - 1 })
      j--
    } else if (i > 0) {
      changes.unshift({ type: 'removed', oldIndex: i - 1 })
      i--
    }
  }

  // Конвертираме промените в DiffLine формат
  changes.forEach((change) => {
    if (change.type === 'unchanged' && change.newIndex !== undefined) {
      diff.push({
        lineNumber: lineNumber++,
        content: newLines[change.newIndex],
        type: 'unchanged',
      })
    } else if (change.type === 'added' && change.newIndex !== undefined) {
      diff.push({
        lineNumber: lineNumber++,
        content: newLines[change.newIndex],
        type: 'added',
      })
    } else if (change.type === 'removed' && change.oldIndex !== undefined) {
      diff.push({
        lineNumber: lineNumber++,
        content: oldLines[change.oldIndex],
        type: 'removed',
        oldContent: oldLines[change.oldIndex],
      })
    }
  })

  return diff
}

/**
 * Проверява дали два реда са "подобни" (над 70% съвпадение)
 */
function areSimilar(line1: string, line2: string): boolean {
  const words1 = line1.toLowerCase().split(/\s+/)
  const words2 = line2.toLowerCase().split(/\s+/)
  const common = words1.filter(w => words2.includes(w)).length
  const similarity = (2 * common) / (words1.length + words2.length)
  return similarity > 0.7
}

/**
 * Подобрява diff-а чрез откриване на модифицирани редове
 */
function enhanceDiff(diff: DiffLine[]): DiffLine[] {
  const enhanced: DiffLine[] = []
  let i = 0

  while (i < diff.length) {
    const current = diff[i]

    // Търсим consecutive removed + added редове
    if (
      current.type === 'removed' &&
      i + 1 < diff.length &&
      diff[i + 1].type === 'added' &&
      areSimilar(current.content, diff[i + 1].content)
    ) {
      // Това е modification
      enhanced.push({
        lineNumber: current.lineNumber,
        content: diff[i + 1].content,
        type: 'modified',
        oldContent: current.content,
      })
      i += 2 // Пропускаме двата реда
    } else {
      enhanced.push(current)
      i++
    }
  }

  return enhanced
}

/**
 * Сравнява два члена и генерира diff
 */
function compareArticles(oldArticle: Article | undefined, newArticle: Article): ArticleChange {
  if (!oldArticle) {
    // Нов член - всички редове са добавени
    return {
      articleNumber: newArticle.number,
      title: newArticle.title,
      changes: newArticle.content.map((line, index) => ({
        lineNumber: index + 1,
        content: line,
        type: 'added',
      })),
    }
  }

  // Генерираме diff между старата и новата версия
  const rawDiff = generateDiff(oldArticle.content, newArticle.content)
  const enhancedDiff = enhanceDiff(rawDiff)

  return {
    articleNumber: newArticle.number,
    title: newArticle.title,
    changes: enhancedDiff,
  }
}

/**
 * Главна функция за сравняване на две версии на закон
 */
export function compareLawVersions(oldVersion: LawVersion, newVersion: LawVersion): ArticleChange[] {
  const changes: ArticleChange[] = []
  const oldArticlesMap = new Map(oldVersion.articles.map(a => [a.number, a]))
  const newArticlesMap = new Map(newVersion.articles.map(a => [a.number, a]))

  // Проверяваме всички членове от новата версия
  for (const newArticle of newVersion.articles) {
    const oldArticle = oldArticlesMap.get(newArticle.number)
    const articleChange = compareArticles(oldArticle, newArticle)

    // Добавяме само ако има промени
    if (articleChange.changes.some(c => c.type !== 'unchanged')) {
      changes.push(articleChange)
    }
  }

  // Проверяваме за премахнати членове
  for (const oldArticle of oldVersion.articles) {
    if (!newArticlesMap.has(oldArticle.number)) {
      changes.push({
        articleNumber: oldArticle.number,
        title: oldArticle.title,
        changes: oldArticle.content.map((line, index) => ({
          lineNumber: index + 1,
          content: line,
          type: 'removed',
          oldContent: line,
        })),
      })
    }
  }

  return changes.sort((a, b) => {
    const numA = parseInt(a.articleNumber) || 0
    const numB = parseInt(b.articleNumber) || 0
    return numA - numB
  })
}

/**
 * Изчислява статистики за промените
 */
export function calculateChangeStats(changes: ArticleChange[]): {
  added: number
  removed: number
  modified: number
} {
  let added = 0
  let removed = 0
  let modified = 0

  changes.forEach(article => {
    article.changes.forEach(line => {
      switch (line.type) {
        case 'added':
          added++
          break
        case 'removed':
          removed++
          break
        case 'modified':
          modified++
          break
      }
    })
  })

  return { added, removed, modified }
}

/**
 * Пример за употреба
 */
export function exampleUsage() {
  const oldVersion: LawVersion = {
    id: 'v1',
    number: '1.0',
    date: '2023-01-01',
    articles: [
      {
        number: '1',
        title: 'Предмет на закона',
        content: [
          'Този закон урежда отношенията в областта на данъците.',
          'Данъците се събират от физически и юридически лица.',
        ],
      },
    ],
  }

  const newVersion: LawVersion = {
    id: 'v2',
    number: '2.0',
    date: '2024-01-01',
    articles: [
      {
        number: '1',
        title: 'Предмет на закона',
        content: [
          'Този закон урежда отношенията в областта на данъците и таксите.',
          'Данъците и таксите се събират от всички физически и юридически лица.',
          'Законът се прилага на територията на Република България.',
        ],
      },
    ],
  }

  const diff = compareLawVersions(oldVersion, newVersion)
  const stats = calculateChangeStats(diff)

  return { diff, stats }
}