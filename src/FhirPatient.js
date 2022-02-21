export class Type {
    text : string

    constructor(text) {
        this.text = text
    }
}

export class Identifier {
    type: Type
    value: string
    system: string

    constructor(type,value) {
        this.type = type
        this.value = value
    }
}

export class Name {
    familyName : string
    givenName : Array<string>
    use : string

    constructor(familyName,givenName){
        this.familyName = familyName
        this.givenName = givenName
        this.use = "preferred"
    }
}

export class Telecom {
    system : string
    value : string

    constructor(system,value) {
        this.system = system
        this.value = value
    }
}

export class Address {
    line: Array<string>
    city: string
    district: string
    state: string
    postalCode: number
    country: string

    constructor(line,city,district,state,postalCode,country) {
        this.line = line
        this.city = city
        this.district = district
        this.state = state
        this.postalCode = postalCode
        this.country = country
    }

}

export class Coding {
    system : string
    code: string

    constructor(system,code) {
        this.system = system
        this.code = code
    }
}
export class RelationShip {
    coding : Array<Coding>

    constructor(coding) {
        this.coding = [coding]
    }
}

export class Contact {
    name : Array<Name>
    relationShip : RelationShip
    telecom : Array<Telecom>

    constructor(name,relationShip,telecom) {
        this.name = name
        this.relationShip = relationShip
        this.telecom = [telecom]
    }
}

export const GENDER = {
    MALE : "male",
    FEMALE : "female",
    OTHER : "other",
    UNKNOWN : "unknown"
}

export class FhirPatient {
    id : string
    identifiers: Array<Identifier>
    gender : GENDER
    names : Array<Name>
    birthDate : string
    address: Array<Address>
    telecom : Array<Telecom>
    contact : Array<Contact>

    constructor(id,identifier,name,gender,dob,address,telecom,contact) {
        this.id = id
        this.gender = gender
        this.identifiers= [identifier]
        this.names = [name]
        this.birthDate = dob
        this.address = [address]
        this.telecom = [telecom]
        this.contact = [contact]
    }
}