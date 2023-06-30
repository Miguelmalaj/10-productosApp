import { StackScreenProps } from '@react-navigation/stack'
import React, { useContext, useEffect, useState } from 'react'
import { TextInput, StyleSheet, Text, View, ScrollView, Button, Image } from 'react-native'
import { ProductsStackParams } from '../navigator/ProductsNavigator';
import { Picker } from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/ProductsContext';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductScreen'>{};

export const ProductScreen = ({ navigation ,route }: Props) => {

    const { id = '', name = '' } = route.params;

    
    const [tempUri, setTempUri] = useState<string>();

    const { categories } =  useCategories();

    const { loadProductById, addProduct, updateProduct, uploadImage } = useContext( ProductsContext );

    const { _id, categoriaId, nombre, img, form, onChange, setFormValue } = useForm({
        _id: id,
        categoriaId: '',
        nombre: name,
        img: ''
    })

    // const [selectedLanguage, setSelectedLanguage] = useState();

    useEffect(() => { //cada efecto se debe de encargar de una tarea en específico
        navigation.setOptions({
            title: ( nombre ) ? nombre : 'Nombre del producto'
        })
    }, [nombre])


    useEffect(() => {
        loadProduct();
    }, [])
    

    const loadProduct = async() => {

        if ( id.length === 0 ) return;

        const product = await loadProductById( id );
        
        setFormValue({
            _id: id,
            categoriaId: product.categoria._id,
            img: product.img || '',
            nombre
        })
    }

    const saveOrUpdate = async() => {
        if ( id.length > 0 ) {
            
            updateProduct( categoriaId, nombre, id );
        } else {
            /* if ( categoriaId.length === 0 ) {
                onChange( categories[0]._id, 'categoriaId' );
            } */

            const tempCategoriaId = categoriaId || categories[0]._id

            const newProduct = await addProduct( tempCategoriaId, nombre ); 
            onChange( newProduct._id, '_id');

        }
    }

    const takePhoto = () => {
        launchCamera({
            mediaType: 'photo',
            quality: 0.5
        }, (resp) => {
            if ( resp.didCancel ) return;
            if ( !resp.assets![0].uri ) return;

            setTempUri( resp.assets![0].uri );
            uploadImage( resp, _id );
            // console.log(resp);
        });
    }
    
    const takePhotoFromGallery = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.5
        }, (resp) => {
            if ( resp.didCancel ) return;
            if ( !resp.assets![0].uri ) return;

            setTempUri( resp.assets![0].uri );
            uploadImage( resp, _id );
            // console.log(resp);
        });
    }
    

    return (
        <View style={ styles.container }>

            <ScrollView>
                <Text style={ styles.label }>Nombre del producto:</Text>
                <TextInput
                    placeholder='Producto'
                    style={ styles.textInput }
                    value={ nombre }
                    onChangeText={ ( value ) => onChange(value, 'nombre') }
                />

                {/* Picker / Selector */}
                <Text style={ styles.label }>Categoría:</Text>
                <Picker
                    selectedValue={ categoriaId }
                    onValueChange={ ( value ) => onChange( value, 'categoriaId' ) }
                >

                    {
                        categories.map( c => (
                            <Picker.Item 
                                label={ c.nombre }
                                value={ c._id }
                                key={ c._id }

                            />

                        ))
                    }
                    
                </Picker>

                <Button
                    title='Guardar'
                    onPress={ saveOrUpdate }
                    color='#008080' 
                />

                {
                    ( _id.length > 0 ) && (

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                            
                            <Button
                                title='Cámara'
                                onPress={ takePhoto }
                                color='#008080'
                            />

                            <View style={{ width:10 }}/>

                            <Button
                                title='Galería'
                                onPress={ takePhotoFromGallery }
                                color='#008080'
                            />

                        </View>
                    )

                }


                {
                    (img.length > 0 && !tempUri) && (
                        <Image 
                        source={{ uri: img }}
                        style={{
                            marginTop: 20,
                            width: '100%',
                            height: 300
                        }}
                        />
                    )
                }

                {/* TODO: MOSTRARIMG temporal */}
                
                {
                    ( tempUri ) && (
                        <Image 
                        source={{ uri: tempUri }}
                        style={{
                            marginTop: 20,
                            width: '100%',
                            height: 300
                        }}
                        />
                    )
                }

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20
    },
    label: {
        fontSize: 18
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 45,
        marginTop: 5,
        marginBottom:15
    }
});