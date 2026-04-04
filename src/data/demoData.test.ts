import { demoData, getCallRecordById } from './demoData'

test('provides executive metrics and detailed records for key demo calls', () => {
  expect(demoData.dashboardMetrics).toHaveLength(4)
  expect(demoData.lossCategories).toHaveLength(4)
  expect(demoData.callListItems.length).toBeGreaterThanOrEqual(6)
  expect(demoData.trendSeries).toHaveLength(7)
  expect(demoData.outcomeDistribution).toHaveLength(5)
  expect(demoData.operatorStats.length).toBeGreaterThanOrEqual(4)
  expect(demoData.moneyImpactScenarios).toHaveLength(3)
  expect(demoData.serviceLineStats).toHaveLength(6)
  expect(demoData.operatorSpotlights).toHaveLength(4)
  expect(demoData.narrativeHighlights).toHaveLength(3)
  expect(demoData.benchmarkStats).toHaveLength(3)

  const nextStepLoss = demoData.lossCategories.find(
    (category) => category.id === 'missing-next-step',
  )

  expect(nextStepLoss?.title).toMatch(/следующ/i)

  const bookedCall = getCallRecordById('10034')

  expect(bookedCall.outcome).toBe('booked')
  expect(bookedCall.patientName).toMatch(/ольга/i)
  expect(bookedCall.evidenceQuotes.length).toBeGreaterThan(1)

  const leakedCall = getCallRecordById('10028')

  expect(leakedCall.outcome).toBe('callback_pending')
  expect(leakedCall.recommendation.toLowerCase()).toContain('обрат')
  expect(leakedCall.operatorId).toBeTruthy()
  expect(leakedCall.audioDuration).toBeGreaterThan(0)
  expect(leakedCall.transcriptSegments.length).toBeGreaterThanOrEqual(3)
  expect(leakedCall.playbackMoments.length).toBeGreaterThanOrEqual(2)
  expect(leakedCall.coachingRewrite.after).toMatch(/заброниру/i)
  expect(leakedCall.expectedOutcomeDelta).toMatch(/запис|follow-up/i)

  const leadOperator = demoData.operatorStats[0]

  expect(leadOperator.name).toMatch(/юлия|евгения|александра|олеся/i)
  expect(leadOperator.callsHandled).toBeGreaterThan(0)
  expect(leadOperator.bookedRate).toMatch(/%/)
})
