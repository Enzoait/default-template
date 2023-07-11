export default {
    items: [
    	{
            displayName: 'Account',
            businessClass: 'com.katappult.core.model.people.account.UserAccount',
            rootType: 'com.katappult.auth.Account'
        },
        {
            displayName: 'Element',
            businessClass: 'com.katappult.part.model.Element',
            rootType: 'com.katappult.Element'
        },
        {
            displayName: 'Document',
            businessClass: 'com.katappult.document.model.Document',
            rootType: 'com.katappult.doc.Document'
        },
        {
            displayName: 'Identification',
            businessClass: 'com.katappult.core.model.multiIdentifiable.Identification',
            rootType: 'com.katappult.id.Identification'
        },
        {
            displayName: 'Container',
            businessClass: 'com.katappult.core.model.composite.Container',
            rootType: 'com.katappult.Container'
        },
        {
            displayName: 'Product instance',
            businessClass: 'com.katappult.shopbase.model.ProductInstance',
            rootType: 'com.katappult.product.ProductInstance'
        },
        {
            displayName: 'Category',
            businessClass: 'com.katappult.classifiable.model.ObjectCategory',
            rootType: 'com.katappult.classification.Category'
        },
        {
            displayName: 'Contact mechanism',
            businessClass: 'com.katappult.contactable.model.ContactMechanism',
            rootType: 'com.katappult.contact.ContactMechanism'
        },
        {
            displayName: 'Product catalog',
            businessClass: 'com.katappult.catalog.model.ObjectCatalog',
            rootType: 'com.katappult.Catalog'
        },
        {
            displayName: 'Product Order',
            businessClass: 'com.katappult.core.shop.Command',
            rootType: 'com.katappult.shop.Order'
        },
        {
            displayName: 'Order',
            businessClass: 'com.katappult.core.shop.Command',
            rootType: 'com.katappult.shop.Order'
        },
        {
            displayName: 'Party',
            businessClass: 'com.katappult.people.model.Party',
            rootType: 'com.katappult.people.Party'
        },
        {
            displayName: 'Organization',
            businessClass: 'com.katappult.people.model.organisation.Organization',
            rootType: 'com.katappult.people.Party/Organization'
        },
        {
            displayName: 'Person',
            businessClass: 'com.katappult.core.model.people.person.Person',
            rootType: 'com.katappult.people.Party/Person'
        },
        {
            displayName: 'Product to Catalog (Link)',
            businessClass: 'com.katappult.shopbase.model.ProductInstanceObjectCatalogLink',
            rootType: 'com.katappult.objectLink.ProductInstanceCatalogLink'
        },
        {
            displayName: 'Product to Category (Link)',
            businessClass: 'com.katappult.shopbase.model.ProductInstanceCategoryClassification',
            rootType: 'com.katappult.objectLink.ProductInstanceCategoryLink'
        },
        {
            displayName: 'Element to Element master (Link)',
            businessClass: 'com.katappult.part.model.ElementToElementMasterLink',
            rootType: 'com.katappult.objectLink.ElementToElementMasterLink'
        },
        {
            displayName: 'Element to Element (Link)',
            businessClass: 'com.katappult.part.model.ElementToElementLink',
            rootType: 'com.katappult.objectLink.ElementToElementLink'
        },
        {
            displayName: 'Element to Document master (Link)',
            businessClass: 'com.katappult.pdm.model.ElementToDocumentMasterLink',
            rootType: 'com.katappult.objectLink.ElementToDocumentMasterLink'
        },
        {
            displayName: 'Element to Document (Link)',
            businessClass: 'com.katappult.pdm.model.ElementToDocumentLink',
            rootType: 'com.katappult.objectLink.ElementToDocumentLink'
        },
        {
            displayName: 'Document to Document master (Link)',
            businessClass: 'com.katappult.document.model.DocumentDocMasterLink',
            rootType: 'com.katappult.objectLink.DocumentToDocumentMasterLink'
        },
        {
            displayName: 'Document to Document (Link)',
            businessClass: 'com.katappult.document.model.DocumentDocumentLink',
            rootType: 'com.katappult.objectLink.DocumentToDocumentLink'
        },
    ],
}