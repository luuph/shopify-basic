'use client'
import {
    ActionList,
    AppProvider,
    Button,
    ButtonGroup,
    ContextualSaveBar,
    FormLayout,
    Frame,
    Layout,
    LegacyCard,
    Loading,
    Modal,
    Navigation,
    Page,
    SkeletonBodyText,
    SkeletonDisplayText,
    SkeletonPage,
    TextContainer,
    TextField,
    Toast,
    TopBar,
    DataTable
} from '@shopify/polaris';
import {ArrowLeftIcon, OrderIcon, SmileyHappyIcon} from '@shopify/polaris-icons';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {setAddressData, setIsLoading, setIsDirty} from '../redux/actions/appActions';

import '@shopify/polaris/build/esm/styles.css';

function Home() {
    const dispatch = useDispatch();
    const addressData = useSelector(state => state.addressData);
    const isLoading = useSelector(state => state.isLoading);
    const isDirty = useSelector(state => state.isDirty);
    const defaultState = useRef({
        emailFieldValue: 'luuph@bsscommerce.com',
        nameFieldValue: 'Hai Luu',
        lastnameFieldValue: 'Luu',
    });
    const skipToContentRef = useRef(null);

    const [toastActive, setToastActive] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [userMenuActive, setUserMenuActive] = useState(false);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [lastnameFieldValue, setLastNameFieldValue] = useState(
        defaultState.current.lastnameFieldValue,
    );
    const [nameFieldValue, setNameFieldValue] = useState(
        defaultState.current.nameFieldValue,
    );
    const [emailFieldValue, setEmailFieldValue] = useState(
        defaultState.current.emailFieldValue,
    );
    const [storeName, setStoreName] = useState(
        defaultState.current.nameFieldValue,
    );
    const [newAddress, setNewAddress] = useState('');
    const [newCity, setNewCity] = useState('');
    const [showAddresses, setShowAddresses] = useState(false);
    const handleAddressesClick = () => {
        setShowAddresses(true);
    };
    const handleAccountClick = () => {
        setShowAddresses(false);
    };
    useEffect(() => {
        let storedData = [];
        fetch('/api/addresses')
            .then(response => response.json())
            .then(data => {
                storedData = data.addresses || [];
                // Lấy dữ liệu addresses từ end point đã làm trong bài tập số 2 và cập nhật vào trong state của addressReducer,
                dispatch(setAddressData(storedData));
                // in ra console
                console.log(addressData);
            })
    }, []);
    const handleSaveAddress = () => {
        const updatedAddressData = [...addressData, {address: newAddress, city: newCity}];
        dispatch(setAddressData(updatedAddressData));
        addAddressDataApi(updatedAddressData);
        setModalActive(false);
    };
    const handleChangeAddress = (value) => {
        setNewAddress(value);
    };
    const handleChangeCity = (value) => {
        setNewCity(value);
    };
    const handleChangeAddresses = useCallback((newValue, index) => {
        dispatch(setAddressData(prevAddressData => {
            const updatedAddressData = [...prevAddressData];
            updatedAddressData[index].address = newValue;
            dispatch(setIsDirty(true));
            return updatedAddressData;
        }));
    }, [dispatch]);
    const handleChangeCityChange = useCallback((newValue, index) => {
        dispatch(setAddressData(prevAddressData => {
            const updatedAddressData = [...prevAddressData];
            updatedAddressData[index].city = newValue;
            dispatch(setIsDirty(true));
            return updatedAddressData;
        }));
    }, [dispatch]);
    const renderTableRows = () => {
        if (addressData.length === 0) {
            const defaultAddress = {address: "", city: ""};
            dispatch(setAddressData([defaultAddress]));
            return (
                <FormLayout>
                    <TextField
                        label="Address (1)"
                        value=""
                        onChange={(newValue) => handleChangeAddresses(newValue, 0)}
                        autoComplete="address_1"
                    />
                    <TextField
                        label="City"
                        value=""
                        onChange={(newValue) => handleChangeCityChange(newValue, 0)}
                        autoComplete="city_1"
                    />
                </FormLayout>
            );
        }
        return addressData.map((address, index) => (
            <FormLayout key={index}>
                <TextField
                    label={"Address (" + (index + 1) + ")"}
                    value={address.address}
                    onChange={(newValue) => handleChangeAddresses(newValue, index)}
                    autoComplete="address_1"
                />
                <TextField
                    label="City"
                    value={address.city}
                    onChange={(newValue) => handleChangeCityChange(newValue, index)}
                    autoComplete="city_1"
                />
            </FormLayout>
        ));
    };

    const addAddressDataApi = (newData) => {
        fetch('/api/add-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Updated address data:', data);
            })
            .catch(error => {
                console.error('Error updating address data:', error);
            });
    };
    const updateAddressDataApi = (newData) => {
        fetch('/api/update-addresses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Updated address data:', data);
            })
            .catch(error => {
                console.error('Error updating address data:', error);
            });
    };

    const handleDiscard = useCallback(() => {
        setEmailFieldValue(defaultState.current.emailFieldValue);
        setNameFieldValue(defaultState.current.nameFieldValue);
        setLastNameFieldValue(defaultState.current.lastnameFieldValue);
        setIsDirty(false);
    }, []);
    const handleSave = useCallback(() => {
        defaultState.current.nameFieldValue = nameFieldValue;
        defaultState.current.emailFieldValue = emailFieldValue;
        updateAddressDataApi(addressData);
        dispatch(setIsDirty(false));
        setStoreName(defaultState.current.nameFieldValue);
    }, [emailFieldValue, nameFieldValue, addressData, dispatch]);
    const handleNameFieldChange = useCallback((value) => {
        setNameFieldValue(value);
        const fullNameArray = value.split(" ");
        setLastNameFieldValue(fullNameArray[fullNameArray.length - 1]);
        value && setIsDirty(true);
    }, []);
    const handleEmailFieldChange = useCallback((value) => {
        setEmailFieldValue(value);
        value && setIsDirty(true);
    }, []);
    const handleSearchResultsDismiss = useCallback(() => {
        setSearchActive(false);
        setSearchValue('');
    }, []);
    const handleSearchFieldChange = useCallback((value) => {
        setSearchValue(value);
        setSearchActive(value.length > 0);
    }, []);
    const toggleToastActive = useCallback(
        () => setToastActive((toastActive) => !toastActive),
        [],
    );
    const toggleUserMenuActive = useCallback(
        () => setUserMenuActive((userMenuActive) => !userMenuActive),
        [],
    );
    const toggleMobileNavigationActive = useCallback(
        () =>
            setMobileNavigationActive(
                (mobileNavigationActive) => !mobileNavigationActive,
            ),
        [],
    );
    const toggleModalActive = useCallback(
        () => setModalActive((modalActive) => !modalActive),
        [],
    );

    const toastMarkup = toastActive ? (
        <Toast onDismiss={toggleToastActive} content="Changes saved"/>
    ) : null;

    const userMenuActions = [
        {
            items: [{content: 'Community forums'}],
        },
    ];

    const contextualSaveBarMarkup = isDirty ? (
        <ContextualSaveBar
            message="Unsaved changes"
            saveAction={{
                onAction: handleSave,
            }}
            discardAction={{
                onAction: handleDiscard,
            }}
        />
    ) : null;

    const userMenuMarkup = (
        <TopBar.UserMenu
            actions={userMenuActions}
            name={lastnameFieldValue}
            detail={storeName}
            initials="D"
            open={userMenuActive}
            onToggle={toggleUserMenuActive}
        />
    );

    const searchResultsMarkup = (
        <ActionList
            items={[{content: 'Shopify help center'}, {content: 'Community forums'}]}
        />
    );

    const searchFieldMarkup = (
        <TopBar.SearchField
            onChange={handleSearchFieldChange}
            value={searchValue}
            placeholder="Search"
        />
    );

    const topBarMarkup = (
        <TopBar
            showNavigationToggle
            userMenu={userMenuMarkup}
            searchResultsVisible={searchActive}
            searchField={searchFieldMarkup}
            searchResults={searchResultsMarkup}
            onSearchResultsDismiss={handleSearchResultsDismiss}
            onNavigationToggle={toggleMobileNavigationActive}
        />
    );

    const navigationMarkup = (
        <Navigation location="/">
            <Navigation.Section
                items={[
                    {
                        label: 'Back to Shopify',
                        icon: ArrowLeftIcon,
                    },
                ]}
            />
            <Navigation.Section
                separator
                title="Hai Luu Shopify Basic"
                items={[
                    {
                        label: 'Account',
                        icon: SmileyHappyIcon,
                        onClick: handleAccountClick,
                    },
                    {
                        label: 'Addresses',
                        icon: OrderIcon,
                        onClick: handleAddressesClick,
                    },
                ]}
            />
        </Navigation>
    );

    const loadingMarkup = isLoading ? <Loading/> : null;

    const skipToContentTarget = (
        <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1}/>
    );

    const actualPageMarkup = (
        <Page title="Account">
            <Layout>
                {skipToContentTarget}
                <Layout.AnnotatedSection
                    title="Account details"
                    description="Jaded Pixel will use this as your account information."
                >
                    <LegacyCard sectioned>
                        <FormLayout>
                            <TextField
                                label="Full name"
                                value={nameFieldValue}
                                onChange={handleNameFieldChange}
                                autoComplete="name"
                            />
                            <TextField
                                type="email"
                                label="Email"
                                value={emailFieldValue}
                                onChange={handleEmailFieldChange}
                                autoComplete="email"
                            />
                        </FormLayout>
                    </LegacyCard>
                    <LegacyCard sectioned>
                        <FormLayout>
                            {renderTableRows()}
                            <ButtonGroup>
                                <Button variant={"secondary"} onClick={toggleModalActive}>New Address</Button>
                                <Button submit variant={"primary"} onClick={handleSave}>Save</Button>
                            </ButtonGroup>
                        </FormLayout>
                    </LegacyCard>
                </Layout.AnnotatedSection>
            </Layout>
        </Page>
    );
    const pageAddressMarkup = (
        <Page title="Addresses">
            <LegacyCard>
                <DataTable
                    columnContentTypes={[
                        'text',
                        'text'
                    ]}
                    headings={[
                        'Address',
                        'City'
                    ]}
                    rows={addressData.map((address, index) => [
                        address.address,
                        address.city,
                    ])}
                />
            </LegacyCard>
        </Page>
    );

    const loadingPageMarkup = (
        <SkeletonPage>
            <Layout>
                <Layout.Section>
                    <LegacyCard sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small"/>
                            <SkeletonBodyText lines={9}/>
                        </TextContainer>
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );

    const pageMarkup = showAddresses ? pageAddressMarkup : actualPageMarkup;

    const modalMarkup = (
        <Modal
            open={modalActive}
            onClose={toggleModalActive}
            title="New Address"
            primaryAction={{
                content: 'Save',
                onAction: handleSaveAddress,
            }}
        >
            <Modal.Section>
                <FormLayout>
                    <TextField
                        label="Address"
                        value={newAddress}
                        onChange={handleChangeAddress}
                        autoComplete="off"
                    />
                    <TextField
                        label="City"
                        value={newCity}
                        onChange={handleChangeCity}
                        autoComplete="off"
                        multiline
                    />
                </FormLayout>
            </Modal.Section>
        </Modal>
    );

    const logo = {
        width: 86,
        topBarSource:
            'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
        contextualSaveBarSource:
            'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
        accessibilityLabel: 'Shopify',
    };
    return (
        <div style={{height: '500px'}}>
            <AppProvider
                i18n={{
                    Polaris: {
                        Avatar: {
                            label: 'Avatar',
                            labelWithInitials: 'Avatar with initials {initials}',
                        },
                        ContextualSaveBar: {
                            save: 'Save',
                            discard: 'Discard',
                        },
                        TextField: {
                            characterCount: '{count} characters',
                        },
                        TopBar: {
                            toggleMenuLabel: 'Toggle menu',

                            SearchField: {
                                clearButtonLabel: 'Clear',
                                search: 'Search',
                            },
                        },
                        Modal: {
                            iFrameTitle: 'body markup',
                        },
                        Frame: {
                            skipToContent: 'Skip to content',
                            navigationLabel: 'Navigation',
                            Navigation: {
                                closeMobileNavigationLabel: 'Close navigation',
                            },
                        },
                    },
                }}
            >
                <Frame
                    logo={logo}
                    topBar={topBarMarkup}
                    navigation={navigationMarkup}
                    showMobileNavigation={mobileNavigationActive}
                    onNavigationDismiss={toggleMobileNavigationActive}
                    skipToContentTarget={skipToContentRef}
                >
                    {contextualSaveBarMarkup}
                    {loadingMarkup}
                    {pageMarkup}
                    {toastMarkup}
                    {modalMarkup}
                </Frame>
            </AppProvider>
        </div>
    )
        ;
}

export default Home;
