import {useEffect, useState, useCallback} from "react";
import {json} from "@remix-run/node";
import {useActionData, useNavigation, useSubmit} from "@remix-run/react";
import {
  Frame,
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  FormLayout,
  TextField,
  Select,
  RadioButton,
  Modal,
  Combobox,
  Icon,
  Listbox, ContextualSaveBar
} from "@shopify/polaris";
import {authenticate} from "../shopify.server";
import SelectProducts from "../components/selectProduct.jsx";

export const loader = async ({request}) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({request}) => {
  const {admin} = await authenticate.admin(request);
  const product = await admin.graphql(
      `#graphql
    query {
      products(first: 10) {
        edges {
          node {
            title
            handle
            featuredImage {
              url
            }
          }
        }
      }
    }`,
  );
  const responseProduct = await product.json();
  const collection = await admin.graphql(
      `#graphql
    query {
      collections(first: 5) {
        edges {
          node {
            title
            handle
          }
        }
      }
    }`,
  );

  const responseCollection = await collection.json();

  return json({
    products: responseProduct.data.products.edges,
    collections: responseCollection.data.collections.edges,
  });
};

export default function Index() {

  const [priceRule, setPriceRule] = useState();
  const [isDirty, setIsDirty] = useState(false);
  const [selected, setSelected] = useState('enable');
  const [name, setName] = useState();
  const [priority, setPriority] = useState(1);
  const [apply, setApply] = useState('all');
  const [price, setPrice] = useState('apply');
  const [amount, setAmount] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    generateProduct();
    const savedName = localStorage.getItem('name');
    const savedPriority = localStorage.getItem('priority');
    const savedSelected = localStorage.getItem('selected');
    const savedAmount = localStorage.getItem('amount');
    const savedApply = localStorage.getItem('apply');
    const savedPrice = localStorage.getItem('price');

    setName(savedName || '');
    setPriority(savedPriority || 1);
    setSelected(savedSelected || 'enable');
    setAmount(savedAmount || 0);
    setApply(savedApply || 'all');
    setPrice(savedPrice || 'apply');
  }, []);
  const handleSave = useCallback(() => {
    localStorage.setItem('name', name);
    localStorage.setItem('priority', priority);
    localStorage.setItem('selected', selected);
    localStorage.setItem('amount', amount);
    localStorage.setItem('apply', apply);
    localStorage.setItem('price', price);

    setIsDirty(false);
  }, [name, priority, selected, amount, apply, price]);

  const handleSelectChange = useCallback(
    (type, value) => {
      switch (type) {
        case 'name':
          setName(value);
          break;
        case 'status':
          setSelected(value);
          break;
        case 'priority':
          setPriority(value);
          break;
        case 'amount':
          setAmount(value);
          break;
      }
      value && setIsDirty(true);
    },
    [],
  );
  const handleChange = useCallback(
    (_, newValue) => {
      setApply(newValue);
      setIsDirty(true);
    },
    [],
  );
  const handlePriceChange = useCallback(
    (_, newValue) => {
      setPrice(newValue);
      setIsDirty(true);
    },
    [],
  );
  const options = [
    {label: 'Enable', value: 'enable'},
    {label: 'Disable', value: 'disable'},
  ];
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const simplifiedProducts = actionData?.products.map(product => ({
    title: product.node.title,
    handle: product.node.handle,
    url: product.node.featuredImage?.url
  }));
  const simplifiedCollections = actionData?.collections.map(collection => ({
    title: collection.node.title,
    handle: collection.node.handle,
  }));

  const handleDiscard = useCallback(() => {
    setIsDirty(false);
  }, []);

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

  const generateProduct = () => submit({}, {replace: true, method: "POST"});

  return (
    <Frame>
      <Page>
        {contextualSaveBarMarkup}
        <ui-title-bar title="New Pricing Rule">
        </ui-title-bar>
        <BlockStack>
          <Layout>
            <Layout.Section>
              <Card>
                <BlockStack>
                  <BlockStack>
                    <FormLayout>
                      <Text as="h2" variant="headingMd">
                        General Information
                      </Text>
                      <TextField label="Name" onChange={(value) => handleSelectChange('name', value)} autoComplete="off"
                                 value={name}/>
                      <TextField
                        max={99}
                        min={0}
                        type="number"
                        label="Priority"
                        onChange={(value) => handleSelectChange('priority', value)}
                        value={priority}
                        autoComplete="email"
                      />
                      <Select
                        label="Status"
                        options={options}
                        onChange={(value) => handleSelectChange('status', value)}
                        value={selected}
                      />
                    </FormLayout>
                  </BlockStack>
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <Card>
                <BlockStack>
                  <BlockStack>
                    <FormLayout>
                      <Text as="h2" variant="headingMd">
                        Apply to Products
                      </Text>
                      <RadioButton
                        label="All products"
                        checked={apply === 'all'}
                        id="all"
                        name="accounts"
                        onChange={handleChange}
                      />
                      <RadioButton
                        label="Specific products"
                        id="specific"
                        name="accounts"
                        checked={apply === 'specific'}
                        onChange={() => {
                          setApply('specific')
                          setOpenModal(true)
                        }}
                      />
                      {apply === 'specific' && simplifiedProducts ? (<SelectProducts value={simplifiedProducts}/>) : null}
                      <RadioButton
                        label="Product collections"
                        id="collections"
                        name="accounts"
                        checked={apply === 'collections'}
                        onChange={handleChange}
                      />
                      {apply === 'collections' && simplifiedCollections ? (<SelectProducts value={simplifiedCollections}/>) : null}
                      <RadioButton
                        label="Product Tags"
                        id="tags"
                        name="accounts"
                        checked={apply === 'tags'}
                        onChange={handleChange}
                      />
                    </FormLayout>
                  </BlockStack>
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <Card>
                <BlockStack>
                  <BlockStack>
                    <FormLayout>
                      <Text as="h2" variant="headingMd">
                        Custom Prices
                      </Text>
                      <RadioButton
                        label="Apply a price to selected products"
                        checked={price === 'apply'}
                        id="apply"
                        name="prices"
                        onChange={handlePriceChange}
                      />
                      <RadioButton
                        label="Decrease a fixed amount of the original prices of selected products"
                        checked={price === 'fixed'}
                        id="fixed"
                        name="prices"
                        onChange={handlePriceChange}
                      />
                      <RadioButton
                        label="Decrease the original prices of selected products by a percentage (%)"
                        checked={price === 'original'}
                        id="original"
                        name="prices"
                        onChange={handlePriceChange}
                      />
                      <TextField type="number" label="Amount" onChange={(value) => handleSelectChange('amount', value)}
                                 autoComplete="off" value={amount}/>
                    </FormLayout>
                  </BlockStack>
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>
        </BlockStack>
      </Page>
    </Frame>
  );
}
