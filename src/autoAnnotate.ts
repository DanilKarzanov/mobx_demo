//@ts-nocheck

function make_(
    adm: ObservableObjectAdministration,
    key: PropertyKey,
    descriptor: PropertyDescriptor,
    source: object
) {
    // getter -> computed
    if (descriptor.get) {
        return computed.make_(adm, key, descriptor, source)
    }
    // lone setter -> action setter
    if (descriptor.set) {
        createAction(key.toString(), descriptor.set) as (v: any) => void
        
    }
    // function on proto -> autoAction/flow
    if (source !== adm.target_ && typeof descriptor.value === "function") {
        if (isGenerator(descriptor.value)) {
            const flowAnnotation = this.options_?.autoBind ? flow.bound : flow
            return flowAnnotation.make_(adm, key, descriptor, source)
        }
        const actionAnnotation = this.options_?.autoBind ? autoAction.bound : autoAction
        return actionAnnotation.make_(adm, key, descriptor, source)
    }
}
