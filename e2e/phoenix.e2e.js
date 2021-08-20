describe('Example', () => {
    beforeAll(async () => {
        await device.launchApp()
    })

    beforeEach(async () => {
        await device.reloadReactNative()
    })

    it('should have a home screen', async () => {
        await expect(element(by.id('homeScreen'))).toBeVisible()
    })

    it('should show high five screen on navigate and return home', async () => {
        await element(by.id('highFiveScreen')).tap()
        await expect(element(by.id('highFive'))).toBeVisible()
        await element(by.id('homeScreen')).tap()
        await expect(element(by.id('home'))).toBeVisible()
        await element(by.id('textfield')).typeText('Detox enabled')
    })
})
