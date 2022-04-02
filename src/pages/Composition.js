import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Skeleton } from 'primereact/skeleton';
import { default as React, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { messageService } from '../redux/messagesducks';
import { CompositionService } from '../service/CompositionService';

const Composition = () => {

    const dispatch = useDispatch();

    const compositionService = new CompositionService();

    const activo = useSelector(store => store.users.activo);
    const perfil = useSelector(store => store.users.perfil);

    const man = useRef(null);
    const esq = useRef(null);
    const pues = useRef(null);

    const [compositions, setCompositions] = useState([]);
    const [esquemas, setEsquemas] = useState([]);
    const [maniobras, setManiobras] = useState([]);
    const [puestos, setPuestos] = useState([]);
    const [loadingCompositions, setLoadingCompositions] = useState(true);
    const [compositionsFilter, setCompositionsFilter] = useState(null);
    const [esquemasFilter, setEsquemasFilter] = useState(null);
    const [maniobrasFilter, setManiobrasFilter] = useState(null);
    const [puestosFilter, setPuestosFilter] = useState(null);
    const [visible, setVisible] = useState(false);

    const fetchCompositions = async () => {
        setLoadingCompositions(true);
        await compositionService.getCompositions().then(data => {
            setCompositions(data);
            setLoadingCompositions(false);
        }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const fetchEsquemas = async () => {
        await compositionService.getEsquemas().then(data => {
            setEsquemas(data);
        }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const fetchManiobras = async () => {
        await compositionService.getManiobras().then(data => {
            setManiobras(data);
        }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const fetchPuestos = async () => {
        await compositionService.getPuestos().then(data => {
            setPuestos(data);
        }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const actionPuestoBodyTemplate = () => {
        return (<>
            <Button icon="pi pi-sitemap" id="button" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={(e) => pues.current.toggle(e)} />
        </>
        )
    }

    const actionManiobraBodyTemplate = () => {
        return (<>
            <Button icon="pi pi-table" id="button" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={(e) => man.current.toggle(e)} />
        </>
        )
    }

    const actionEsquemaBodyTemplate = () => {
        return (<>
            <Button icon="pi pi-cog" id="button" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={(e) => esq.current.toggle(e)} />
        </>
        )
    }

    const actionCompositionBodyTemplate = (rowData) => {
        return (<>
            <Button icon="pi pi-users" id="button" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={() => setVisible(true)} />
        </>
        )
    }

    const headerCompositions = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setCompositionsFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const headerEsquemas = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setEsquemasFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const headerManiobras = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setManiobrasFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const headerPuestos = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setPuestosFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    useEffect(() => {
        if (activo) {
            fetchCompositions()
        }
    }, [setCompositions, activo]);

    useEffect(() => {
        if (activo) {
            fetchEsquemas();
        }
    }, [setEsquemas, activo]);

    useEffect(() => {
        if (activo) {
            fetchManiobras();
        }
    }, [setManiobras, activo]);

    useEffect(() => {
        if (activo) {
            fetchPuestos();
        }
    }, [setPuestos, activo]);

    return (
        activo && perfil === 3 ? (
            <div className="col-12">
                <div className="card">
                    <h5>Composición Maniobras</h5>
                    <DataTable value={compositions} dataKey="id" loading={loadingCompositions}
                        paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Modelos"
                        globalFilter={compositionsFilter} emptyMessage="Sin Datos." header={headerCompositions} responsiveLayout="scroll">
                        <Column field="esquemaStr" header="Esquema" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionEsquemaBodyTemplate}></Column>
                        <Column field="maniobraStr" header="Maniobra" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionManiobraBodyTemplate}></Column>
                        <Column field="puestoStr" header="Puesto" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionPuestoBodyTemplate}></Column>
                        <Column field="cantidad" header="Cantidad" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionCompositionBodyTemplate}></Column>
                    </DataTable>
                </div>

                <OverlayPanel ref={esq}>
                    <DataTable value={esquemas} dataKey="id"
                        paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Esquemas"
                        globalFilter={esquemasFilter} emptyMessage="Sin Datos." header={headerEsquemas} responsiveLayout="scroll">
                        <Column field="detalle" header="Esquema" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionEsquemaBodyTemplate}></Column>
                    </DataTable>
                </OverlayPanel>

                <OverlayPanel ref={man}>
                    <DataTable value={maniobras} dataKey="id"
                        paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Esquemas"
                        globalFilter={maniobrasFilter} emptyMessage="Sin Datos." header={headerManiobras} responsiveLayout="scroll">
                        <Column field="detalle" header="Maniobra" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionManiobraBodyTemplate}></Column>
                    </DataTable>
                </OverlayPanel>

                <OverlayPanel ref={pues}>
                    <DataTable value={puestos} dataKey="id"
                        paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Puestos"
                        globalFilter={puestosFilter} emptyMessage="Sin Datos." header={headerPuestos} responsiveLayout="scroll">
                        <Column field="detalle" header="Puesto" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionPuestoBodyTemplate}></Column>
                    </DataTable>
                </OverlayPanel>
            </div>
        ) : (<div className="card">
            <h4>Requiere Autenticación</h4>
            <div className="border-round border-1 surface-border p-4">
                <div className="flex mb-3">
                    <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                    <div>
                        <Skeleton width="10rem" className="mb-2"></Skeleton>
                        <Skeleton width="5rem" className="mb-2"></Skeleton>
                        <Skeleton height=".5rem"></Skeleton>
                    </div>
                </div>
                <Skeleton width="100%" height="150px"></Skeleton>
                <div className="flex justify-content-between mt-3">
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                </div>
            </div>
        </div>)
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Composition, comparisonFn);  